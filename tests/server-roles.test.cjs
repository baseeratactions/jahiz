// Tests the client-system server (server/Code.gs + server/DemoAccounts.gs) from every role: visitor, client, full admin, limited employee.
// Run: node tests/server-roles.test.cjs
const load = require('./gas-harness.cjs');
const SRV = process.argv[2] || require('path').join(__dirname, '..', 'server');
const g = load([SRV + '/Code.gs', SRV + '/DemoAccounts.gs']);
const { post, ctx } = g;
let pass = 0, fail = 0;
const t = (name, cond, extra) => { if (cond) { pass++; console.log('✓ ' + name); } else { fail++; console.log('✗ ' + name, extra !== undefined ? JSON.stringify(extra).slice(0, 300) : ''); } };

ctx.setup();
// --- visitor (no account) ---
t('الزائر: الخادم يرد على الصفحة العامة (doGet)', JSON.parse(ctx.doGet().text).ok);
t('الزائر: يقرأ قائمة الخدمات', post({ action: 'catalog' }).ok !== false);
t('الزائر: لا يقرأ بيانات العملاء (list)', post({ action: 'list' }).error === 'auth');
t('الزائر: لا يفتح حساب عميل بلا جلسة (cme)', post({ action: 'cme' }).error === 'auth');
t('الزائر: لا يغيّر الموقع (saveSite)', post({ action: 'saveSite', site: {} }).error === 'auth');
t('الزائر: يرسل طلب خدمة', post({ action: 'request', name: 'زائر', phone: '55123456', codes: ['A1'], services: 'خدمة', accept: true }).ok, post({ action: 'request', name: 'زائر2', phone: '55123457', codes: ['A1'], services: 'خدمة', accept: true }));

// --- create the demo accounts ---
const lines = ctx.createDemoAccounts();
const cpw = lines[0].match(/كلمة المرور (\S+)/)[1], apw = lines[1].match(/كلمة المرور (\S+)/)[1];
t('إنشاء الحسابين: كلمتا مرور قويتان (14 حرفاً)', cpw.length === 14 && apw.length === 14 && /[A-Z]/.test(apw) && /\d/.test(apw));
t('إنشاء الحسابين: بريد البيانات أُرسل لبريد المكتب ومن شغّل الدالة', g.mails.some(m => /الحسابات التجريبية/.test(m.subject) && /owner@example.com/.test(m.to)));
t('القاعدة 12: تنبيه أمني عاجل بإنشاء مدير شامل', g.mails.some(m => /تنبيه أمني عاجل/.test(m.subject) && /المدير الشامل/.test(m.subject)) && g.fetches.some(u => /callmebot/.test(u)));

// --- client ---
const cl = post({ action: 'clogin', username: 'demo.client', password: cpw });
t('العميل: يدخل باسم المستخدم وكلمة المرور', cl.ok && cl.token, cl);
t('العميل: كلمة مرور خاطئة مرفوضة', post({ action: 'clogin', username: 'demo.client', password: 'wrong-pass' }).error === 'wrong_login');
const me = post({ action: 'cme', token: cl.token });
t('العميل: يفتح ملفه «عميل تجريبي»', me.ok && me.client.name === 'عميل تجريبي', me);
t('العميل: لا يرى ملاحظات المكتب الداخلية', me.ok && me.client.notes === undefined);
t('العميل: يطلب خدمة من حسابه', post({ action: 'crequest', token: cl.token, codes: ['A1'], services: 'خدمة تجريبية' }).ok !== false);
t('العميل: يراسل المكتب', post({ action: 'cmsg', token: cl.token, body: 'رسالة تجريبية' }).ok);
t('العميل: رمزه لا يفتح لوحة الإدارة (list)', post({ action: 'list', token: cl.token }).error === 'auth');
t('العميل: رمزه لا يدير الموظفين (staffSave)', post({ action: 'staffSave', token: cl.token, username: 'x', role: 'admin', password: '12345678' }).error === 'auth');
t('العميل: رمز مزوّر مرفوض', post({ action: 'cme', token: cl.token.slice(0, -3) + 'abc' }).error === 'auth');

// --- super admin ---
const ad = post({ action: 'login', username: 'superadmin', password: apw });
t('المدير الشامل: يدخل لوحة الإدارة', ad.ok && ad.token, ad);
t('المدير الشامل: لا يُطلب منه تغيير كلمة المرور أولاً', ad.ok && !ad.me.mustChange);
t('المدير الشامل: دوره «مدير» ومعه كل الصلاحيات (' + (ad.me && ad.me.perms.length) + ')', ad.me.role === 'admin' && ad.me.perms.length === ctx.PERMS.length);
const all = post({ action: 'list', token: ad.token });
t('المدير الشامل: يرى كل العملاء والطلبات والرسائل', all.ok && all.data.Clients.length >= 2 && all.data.Messages.length >= 1 && all.data.Requests.length >= 1, all.data && Object.keys(all.data));
t('المدير الشامل: لا تصل كلمات المرور المشفرة للمتصفح', all.ok && all.data.Accounts.every(a => a.hash === undefined && a.salt === undefined));
t('المدير الشامل: يدير الموظفين', post({ action: 'staffUsers', token: ad.token }).ok);
t('المدير الشامل: يرد على العميل', post({ action: 'reply', token: ad.token, clientId: me.client.id, body: 'رد تجريبي' }).ok);
t('المدير الشامل: يعدّل نصوص الموقع', post({ action: 'saveSite', token: ad.token, site: { ar: {}, en: {} } }).ok);
t('المدير الشامل: يرى تقارير الموظفين', post({ action: 'report', token: ad.token, from: '2026-01-01', to: '2026-12-31' }).ok);
const emp = post({ action: 'staffSave', token: ad.token, username: 'employee1', name: 'موظف تجريبي', role: 'staff', perms: ['requests', 'messages'], status: 'مفعّل', password: 'TempPass123' });
t('المدير الشامل: يضيف موظفاً بصلاحيات محدودة', emp.ok, emp);

// --- employee (limited) ---
let e = post({ action: 'login', username: 'employee1', password: 'TempPass123' });
t('الموظف: أول دخول يفرض تغيير كلمة المرور', e.ok && post({ action: 'list', token: e.token }).error === 'must_change');
e = post({ action: 'staffPass', token: e.token, old: 'TempPass123', password: 'NewPass4567' });
t('الموظف: يغيّر كلمة المرور', e.ok, e);
const el = post({ action: 'list', token: e.token });
t('الموظف: يرى الطلبات والمراسلات', el.ok && el.data.Requests.length >= 1);
t('الموظف: لا يرى الحسابات المالية ولا بيانات البوابات', el.ok && el.data.Payments.length === 0 && el.data.Credentials.length === 0);
t('الموظف: ممنوع من إدارة الموظفين', post({ action: 'staffSave', token: e.token, username: 'hacker', role: 'admin', password: 'Hack12345' }).error === 'admin_only');
t('الموظف: ممنوع من حذف العملاء', post({ action: 'delete', token: e.token, sheet: 'Clients', id: me.client.id }).error === 'admin_only');
t('الموظف: ممنوع من إظهار كلمات مرور البوابات', post({ action: 'reveal', token: e.token, id: 'P-0001' }).error === 'no_permission');
t('الموظف: ممنوع من تعديل الموقع', post({ action: 'saveSite', token: e.token, site: {} }).error === 'admin_only');

// --- re-run: rotates passwords, no duplicates ---
const lines2 = ctx.createDemoAccounts();
const cpw2 = lines2[0].match(/كلمة المرور (\S+)/)[1];
t('إعادة التشغيل: كلمة المرور القديمة لم تعد تعمل', post({ action: 'clogin', username: 'demo.client', password: cpw }).error === 'wrong_login');
t('إعادة التشغيل: الجديدة تعمل', post({ action: 'clogin', username: 'demo.client', password: cpw2 }).ok);
t('إعادة التشغيل: جلسة المدير القديمة أُغلقت', post({ action: 'list', token: ad.token }).error === 'auth');
const ad2 = post({ action: 'login', username: 'superadmin', password: lines2[1].match(/كلمة المرور (\S+)/)[1] });
const all2 = post({ action: 'list', token: ad2.token });
t('إعادة التشغيل: لا حسابات مكررة', all2.data.Accounts.filter(a => a.username === 'demo.client').length === 1 && post({ action: 'staffUsers', token: ad2.token }).rows.filter(s => s.username === 'superadmin').length === 1);
t('المدير الأول 123 ما زال يطلب تغيير بياناته', post({ action: 'login', username: '123', password: '123' }).me?.mustChange === 'نعم');

console.log(`\n${pass} ناجح · ${fail} فاشل`);
process.exitCode = fail ? 1 : 0;

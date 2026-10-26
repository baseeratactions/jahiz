/**
 * جاهز: خادم نظام العملاء والطلبات (Google Apps Script + Google Sheets)
 *
 * ما يفعله:
 *  - يستقبل طلبات الموقع ويحفظها في ورقة «الطلبات»، وينشئ العميل أو يربطه برقم جواله.
 *  - يرسل للعميل رداً تلقائياً بالبريد برقم الطلب، ويرسل إشعاراً لبريد المكتب.
 *  - يخدم صفحة «نظام العملاء» (crm.html): العملاء، المعاملات، الطلبات، السجل، إرسال البريد.
 *  - يرسل كل صباح تذكيراً للمكتب بالتجديدات القريبة والمعاملات المتأخرة.
 *  - يخدم صفحة «حسابي» (portal.html): حساب لكل عميل باسم مستخدم وكلمة مرور، يطلب منه الخدمات
 *    ويتابع طلباته ومعاملاته وينزّل ملفاته وتراخيصه. الملفات تُحفظ خاصة في Google Drive للمكتب
 *    ولا يصل إليها العميل إلا عبر حسابه.
 *
 * التشغيل لأول مرة: راجع ملف «اقرأني - تشغيل نظام العملاء.txt».
 */

var SHEETS = {
  Clients: ['id','created','name','type','phone','email','qid','cr','estCard','taxNo','plan','planEnd','address','source','requirements','notes','updated'],
  // new columns are always appended at the end so sheets created by an older version keep working
  Transactions: ['id','created','clientId','code','service','status','fee','govFee','paid','govRef','startDate','dueDate','expiryDate','assignee','docs','notes','closed','updated','progress'],
  Requests: ['id','created','name','phone','email','type','plan','services','codes','lang','status','clientId','mailed','notes','updated','assignee','due'],
  Log: ['id','created','clientId','txnId','kind','subject','body','by'],
  Accounts: ['id','created','clientId','username','salt','hash','status','lastLogin','updated'],
  Files: ['id','created','clientId','txnId','title','url','fileId','by'],
  Consents: ['id','created','clientId','name','phone','docs','version','lang','source'],
  Credentials: ['id','created','clientId','portal','username','secret','note','by','updated'],
  Messages: ['id','created','clientId','from','by','body','read'],
  Staff: ['id','created','username','name','role','salt','hash','status','mustChange','lastLogin','updated',
          'jobTitle','phone','email','qid','hireDate','shiftStart','shiftEnd','workDays','perms','notes',
          'salary','allowance','contractType','contractStart','contractEnd','nationality','leaveDays',
          'empNo','department','specialty','skills','qualification','experience','languages','birthDate','gender','maritalStatus','address','workLocation','manager','probationEnd',
          'qidExpiry','passportNo','passportExpiry','visaExpiry','healthCardExpiry','licenseExpiry','emergencyName','emergencyRelation','emergencyPhone','bankName','iban'],
  Sessions: ['id','created','staffId','username','login','lastSeen','logout','minutes','closedBy'],
  Activity: ['id','created','staffId','username','action','sheet','recordId','clientId','summary'],
  // work assigned to an employee that is not a transaction (a visit, a follow-up call, collecting a document)
  Tasks: ['id','created','title','assignee','clientId','txnId','due','priority','progress','status','notes','by','done','updated'],
  // money received from clients, one row per payment (the transaction's 'paid' is their total)
  Payments: ['id','created','clientId','txnId','date','amount','method','receiptNo','note','by'],
  // money the office spends: government fees paid for clients, transport, salaries, rent and the rest
  Expenses: ['id','created','date','category','amount','txnId','clientId','note','by','account'],
  // accounting: accounts added to the built-in chart, and manual journal entries (payments and expenses post automatically)
  Coa: ['id','created','code','name','nameEn','type','updated'],
  Journal: ['id','created','date','memo','ref','lines','by','updated'],
  // human resources
  Leaves: ['id','created','username','type','from','to','days','status','note','decidedBy','updated'],
  Payroll: ['id','created','month','username','basic','allowances','deductions','net','status','paidDate','note','by','updated','expenseId'],
  Evals: ['id','created','username','period','scores','total','note','by'],
  Budget: ['id','created','year','code','amount','updated'],
  // a client's rating of a finished transaction; shown on the site only with the client's consent and the manager's approval
  Reviews: ['id','created','clientId','txnId','stars','comment','publish','name','status','by','updated'],
  // website ads managed by the admin, shown on the home page with the label «إعلان»
  Ads: ['id','created','title','titleEn','text','textEn','image','imageId','link','start','end','active','sort','by','updated'],
  SecurityLog: ['id','created','level','event','who','detail']
};
var PREFIX = {Clients:'C', Transactions:'T', Requests:'R', Log:'L', Accounts:'A', Files:'F', Consents:'K', Credentials:'P', Messages:'M', Staff:'S', Sessions:'W', Activity:'X', Tasks:'J', Payments:'Y', Expenses:'E', Coa:'G', Journal:'V', Leaves:'H', Payroll:'Q', Evals:'U', Budget:'B', SecurityLog:'Z', Reviews:'N', Ads:'D'};
var AD_IMAGE_KB = 800;   // an ad picture: PNG, JPEG or WebP, up to 800 KB, published as a public image
// permissions an admin grants to each employee; an admin has all of them plus staff management and reports
var PERMS = ['requests','clients_view','clients_edit','transactions','finance','messages','files','accounts','credentials','email','delete','log','assign','hr'];
var LEAVE_TYPES = ['سنوية', 'مرضية', 'طارئة', 'بدون راتب', 'أخرى'];
var TASK_ST = ['جديدة', 'قيد التنفيذ', 'منجزة', 'ملغاة'];
var PAY_METHODS = ['نقداً', 'تحويل بنكي', 'بطاقة', 'شيك', 'أخرى'];
var SESSION = null;   // the attendance session id of the current staff request
// first admin login; the system forces a change of both on first sign-in
var FIRST_ADMIN_USER = '123', FIRST_ADMIN_PASSWORD = '123';
// security alerts go by email to OFFICE_EMAIL plus any addresses in the Script Property ALERT_EMAILS (comma separated).
var COMPANY = 'جاهز';
var STAFF_LOCK_FAILS = 8, STAFF_LOCK_SECONDS = 900;   // a staff username locks for 15 minutes after 8 wrong passwords
var CLIENT_LOCK_FAILS = 10;                            // a client account locks for an hour after 10 wrong passwords
var PUBLIC_PER_HOUR = 80;                              // all public forms together (requests, sign-ups); protects the mail quota
var TOKEN_BAD = false;
var STAFF = null;   // the signed-in staff member for the current request
// legal documents the client accepts (legal.html). Bump LEGAL_VERSION when the text changes.
var LEGAL_VERSION = '1.0';
var LEGAL_DOCS = 'اتفاقية الخدمة، حدود المسؤولية، التفويض، البيانات والسرية';
var TOKEN_HOURS = 12;          // staff session
var CLIENT_TOKEN_HOURS = 24;   // client session
var PW_ROUNDS = 500;
var MAX_UPLOAD_MB = 10;
var ACC_ACTIVE = 'مفعّل', ACC_PENDING = 'بانتظار التفعيل', ACC_OFF = 'موقوف';
// what a client may see of their own records (internal notes and staff fields stay hidden)
var CLIENT_FIELDS = ['id','name','type','phone','email','qid','cr','estCard','taxNo','plan','planEnd','address'];
var CLIENT_EDITABLE = ['name','type','email','qid','cr','estCard','taxNo','address'];
var TXN_FIELDS = ['id','created','code','service','status','fee','govFee','paid','govRef','startDate','dueDate','expiryDate','docs','closed','updated','progress'];
var PAY_FIELDS = ['id','txnId','date','amount','method','receiptNo'];
var REQ_FIELDS = ['id','created','services','plan','status','updated'];

// ---------- setup (run once from the editor) ----------
function setup() {
  var ss = SpreadsheetApp.getActive();
  Object.keys(SHEETS).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    sh.getRange(1, 1, 1, SHEETS[name].length).setValues([SHEETS[name]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty('SECRET')) p.setProperty('SECRET', Utilities.getUuid() + Utilities.getUuid());
  if (!p.getProperty('OFFICE_EMAIL')) p.setProperty('OFFICE_EMAIL', 'munijizqa@gmail.com');
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'dailyReminders') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyReminders').timeBased().everyDays(1).atHour(7).create();
  ensureAdmin();
  sheet('SecurityLog');
  Logger.log('تم الإعداد. الدخول الأول للإدارة: اسم المستخدم 123 وكلمة المرور 123، وسيطلب النظام تغييرهما فوراً. بريد المكتب: ' + p.getProperty('OFFICE_EMAIL'));
}

// ---------- HTTP ----------
function doGet() { return json({ok: true, service: 'jahiz-crm'}); }

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { watch('bad_json', 60, 'طلبات مشوهة كثيرة على الخادم', ''); return json({ok: false, error: 'bad_json'}); }
  if (!req || typeof req !== 'object') return json({ok: false, error: 'bad_json'});
  try {
    if (req.action === 'request') return json(publicRequest(req));
    if (req.action === 'register') return json(publicRegister(req));
    if (req.action === 'theme') { var th = prop('THEME'); return json({ok: true, theme: th ? JSON.parse(th) : null}); }
    if (req.action === 'catalog') return json(catalogGet(req.ver));
    if (req.action === 'market') return json(marketGet(req.ver, false));
    if (req.action === 'track') return json(publicTrack(req));
    if (req.action === 'reviews') return json(publicReviews());
    if (req.action === 'ads') return json(publicAds());
    if (req.action === 'site') { var sx = prop('SITE_TEXT'); return json({ok: true, site: sx ? JSON.parse(sx) : null}); }
    if (req.action === 'login') return json(login(req.username, req.password));
    if (req.action === 'signup') return json(clientSignup(req));
    if (req.action === 'clogin') return json(clientLogin(req));
    if (req.action === 'cforgot') return json(clientForgot(req));
    if (req.action === 'creset') return json(withLock(function () { return clientReset(req); }));
    if (['cme', 'cprofile', 'crequest', 'cpass', 'cfile', 'ccred', 'ccreddel', 'cmsg', 'creview'].indexOf(req.action) >= 0) {
      var acc = checkClientToken(req.token);
      if (!acc) { if (TOKEN_BAD) badToken('client'); return json({ok: false, error: 'auth'}); }
      switch (req.action) {
        case 'cme': return json(clientMe(acc));
        case 'cprofile': return json(withLock(function () { return clientProfile(acc, req.profile || {}); }));
        case 'crequest': return json(clientRequest(acc, req));
        case 'cpass': return json(withLock(function () { return clientPassword(acc, req.old, req.password); }));
        case 'cfile': return json(clientFile(acc, req.id));
        case 'cmsg': return json(withLock(function () { return clientMessage(acc, req.body); }));
        case 'ccred': return json(withLock(function () { return clientCredential(acc, req); }));
        case 'ccreddel': return json(withLock(function () { return clientCredentialDelete(acc, req.id); }));
        case 'creview': return json(withLock(function () { return clientReview(acc, req); }));
        default: return json({ok: false, error: 'unknown_action'});
      }
    }
    STAFF = checkToken(req.token);
    if (!STAFF) { if (TOKEN_BAD) badToken('staff'); return json({ok: false, error: 'auth'}); }
    if (req.action === 'staffMe') return json({ok: true, me: publicStaff(STAFF)});
    if (req.action === 'staffPass') return json(withLock(function () { return staffChangeOwn(req); }));
    if (req.action === 'staffLogout') return json(withLock(function () { return staffLogout(); }));
    if (STAFF.mustChange) return json({ok: false, error: 'must_change'});
    var need = permFor(req);
    if (need && !can(need)) {
      secLog('medium', 'محاولة إجراء بدون صلاحية', STAFF.username, req.action + (req.sheet ? ' / ' + req.sheet : ''));
      watch('deny_' + STAFF.id, 5, 'الموظف يحاول مرات كثيرة إجراءات ليست من صلاحياته', STAFF.username);
      return json({ok: false, error: need === 'admin' ? 'admin_only' : 'no_permission'});
    }
    touchSession();
    switch (req.action) {
      case 'list': watch('list_' + STAFF.id, 120, 'تحميل كامل بيانات العملاء مرات كثيرة جداً خلال ساعة', STAFF.username); return json({ok: true, data: listAll(), me: publicStaff(STAFF)});
      case 'staffUsers': return json({ok: true, rows: rows('Staff').map(publicStaff), perms: PERMS});
      case 'staffSave': return json(withLock(function () { return staffSave(req); }));
      case 'report': return json(staffReport(req.from, req.to));
      case 'reportEmail': return json(emailReport(req.from, req.to));
      case 'reply': return json(withLock(function () { return staffReply(req); }));
      case 'save':
        if (req.sheet === 'Payments') return json(withLock(function () { return savePayment(req.row || {}); }));
        if (req.sheet === 'Accounts') return json({ok: false, error: 'use_clientAccount'});
        if (['Credentials', 'Consents', 'Staff', 'Messages', 'Sessions', 'Activity', 'SecurityLog', 'Reviews', 'Ads'].indexOf(req.sheet) >= 0) return json({ok: false, error: 'read_only'});
        if (req.sheet === 'Log' && req.row) { req.row.by = STAFF.username; req.row.id = ''; }   // log entries are only ever added, never rewritten
        return json(withLock(function () { return {ok: true, row: staffSaveRow(req.sheet, req.row || {})}; }));
      case 'delete': return json(withLock(function () {
        if (['Staff', 'Consents', 'Sessions', 'Activity', 'SecurityLog', 'Reviews', 'Ads'].indexOf(req.sheet) >= 0) return {ok: false, error: 'read_only'};
        if (req.sheet === 'Clients') secLog('high', 'حذف ملف عميل كامل', STAFF.username, String(req.id));
        watch('del_' + STAFF.id, 15, 'حذف عدد كبير من السجلات خلال ساعة', STAFF.username);
        if (req.sheet === 'Files') trashDriveFile(req.id);
        if (req.sheet === 'Payments') return deletePayment(req.id);
        if (['Expenses', 'Journal'].indexOf(req.sheet) >= 0 && prop('LOCK_DATE')) { var dd = rows(req.sheet).filter(function (x) { return x.id === req.id; })[0]; if (dd && String(dd.date) <= prop('LOCK_DATE')) return {ok: false, error: 'period_locked'}; }
        var gone = rows(req.sheet).filter(function (x) { return x.id === req.id; })[0] || {};
        var done = deleteRow(req.sheet, req.id);
        if (done) audit('delete', req.sheet, req.id, gone.clientId || (req.sheet === 'Clients' ? req.id : ''), 'حذف ' + (gone.service || gone.name || gone.title || req.id));
        return {ok: done};
      }));
      case 'sendEmail': return json(withLock(function () { var r = sendClientEmail(req); if (r.ok) audit('email', 'Log', '', req.clientId, 'بريد للعميل: ' + clean(req.subject, 120)); return r; }));
      case 'clientAccount': return json(withLock(function () { var r = staffAccount(req); if (r.ok) audit('account', 'Accounts', r.row.id, req.clientId, 'حساب العميل: ' + r.row.status + (req.password ? ' · كلمة مرور جديدة' : '')); return r; }));
      case 'upload': return json(withLock(function () { var r = staffUpload(req); if (r.ok) audit('file', 'Files', r.row.id, req.clientId, 'رفع ملف: ' + r.row.title); return r; }));
      case 'reveal': watch('rev_' + STAFF.id, 6, 'إظهار كلمات مرور بوابات العملاء مرات كثيرة خلال ساعة', STAFF.username); return json(withLock(function () { return staffReveal(req.id); }));
      case 'saveTheme': return json(saveTheme(req.theme));
      case 'saveSite': return json(withLock(function () { return saveSite(req.site); }));
      case 'saveCatalog': return json(withLock(function () { return catalogSave(req.catalog); }));
      case 'marketAdmin': return json(marketGet('', true));
      case 'saveMarket': return json(withLock(function () { return marketSave(req.market, req.priv); }));
      case 'adsList': return json({ok: true, rows: rows('Ads')});
      case 'adsSave': return json(withLock(function () { return adSave(req); }));
      case 'adsDel': return json(withLock(function () { return adDelete(req.id); }));
      case 'reviewSet': return json(withLock(function () { return reviewSet(req.id, req.status); }));
      case 'setLock': return json(withLock(function () { return setLock(req.date); }));
      case 'auditTrail': return json(auditTrail(req.from, req.to));
      case 'myLeave': return json(withLock(function () { return myLeave(req); }));
      case 'myUpdate': return json(withLock(function () { return myUpdate(req); }));
      case 'payment': return json(withLock(function () { return savePayment(req.row || {}); }));
      case 'paymentDel': return json(withLock(function () { return deletePayment(req.id); }));
      default: return json({ok: false, error: 'unknown_action'});
    }
  } catch (err) { return json({ok: false, error: String(err && err.message || err)}); }
}

// ---------- security: log, counters and urgent alerts ----------
function cinc(k, ttl) { var c = CacheService.getScriptCache(), n = Number(c.get(k) || 0) + 1; c.put(k, String(n), ttl || 3600); return n; }
function cget(k) { return Number(CacheService.getScriptCache().get(k) || 0); }
// counts an event for an hour and raises one urgent alert when it reaches the limit
function watch(key, limit, event, who) { var n = cinc('w_' + key, 3600); if (n === limit) secLog('high', event, who, n + ' مرة خلال ساعة'); return n; }
function badToken(kind) { secLog('medium', 'دخول برمز جلسة مزوّر أو ملغى', kind, ''); watch('badtok', 20, 'محاولات كثيرة بأختام جلسة مزوّرة (محاولة اختراق)', kind); }
function secLog(level, event, who, detail) {
  if (level !== 'high' && cinc('seclog_rows', 3600) > 300) return;   // a flood of small events cannot fill the sheet
  try { saveRow('SecurityLog', {level: level, event: event, who: clean(who, 80), detail: clean(detail, 500)}); } catch (err) {}
  if (level === 'high') { try { alertOwner(event, who, detail); } catch (err) {} }
}
function alertEmails() {
  return [prop('OFFICE_EMAIL')].concat(prop('ALERT_EMAILS').split(',')).map(function (x) { return String(x).trim(); })
    .filter(function (x, i, a) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x) && a.indexOf(x) === i; });
}
// the same alert is sent at most once every 30 minutes, and at most 40 alerts a day, so an attack cannot use up the mail quota
function alertOwner(event, who, detail) {
  var c = CacheService.getScriptCache(), k = 'al_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, event + '|' + who, Utilities.Charset.UTF_8));
  if (c.get(k)) return; c.put(k, '1', 1800);
  if (cinc('al_day', 86400) > 40) return;
  sendInstant('🚨 ' + COMPANY + ': ' + event + (who ? ' · ' + who : '') + (detail ? ' · ' + detail : '') + ' · ' + now());
  var to = alertEmails(); if (!to.length) return;
  MailApp.sendEmail({to: to.join(','), name: 'حماية ' + COMPANY, subject: '🚨 تنبيه أمني عاجل (' + COMPANY + '): ' + event,
    htmlBody: shell('<p style="color:#a11"><b>تنبيه أمني عاجل</b></p><p><b>' + escHtml(event) + '</b></p><p>الحساب أو المصدر: ' + escHtml(who || '—') + '<br>التفاصيل: ' + escHtml(detail || '—') + '<br>الوقت: ' + now() + '</p>' +
      '<p>ما فعله النظام تلقائياً: سجّل الحدث في ورقة SecurityLog، وأوقف المحاولات المتكررة مؤقتاً.</p><p>ما يلزمك: إذا لم تكن أنت أو أحد موظفيك، افتح لوحة الإدارة وغيّر كلمة المرور، وأوقف حساب الموظف المعني من «الموظفون».</p>')});
}
function securitySummaryHtml() {
  var since = Utilities.formatDate(new Date(Date.now() - 86400000), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
  var ev = rows('SecurityLog').filter(function (x) { return String(x.created) >= since; });
  if (!ev.length) return '';
  var byEvent = {}; ev.forEach(function (x) { var k = x.level + '|' + x.event; byEvent[k] = (byEvent[k] || 0) + 1; });
  return '<h3>الأمان خلال 24 ساعة</h3><ul>' + Object.keys(byEvent).sort().map(function (k) { var p = k.split('|'); return '<li>' + (p[0] === 'high' ? '🚨 ' : '') + escHtml(p[1]) + ': ' + byEvent[k] + '</li>'; }).join('') + '</ul>';
}


function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function withLock(fn) { var l = LockService.getScriptLock(); l.waitLock(20000); try { return fn(); } finally { l.releaseLock(); } }
function prop(k) { return PropertiesService.getScriptProperties().getProperty(k) || ''; }

// ---------- auth ----------
function sign(s) { var k = prop('SECRET'); if (!k) throw new Error('not_setup'); return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(s, k)); }
// a session is tied to the current password: changing or resetting it ends every older session
function tv(x) { return String(x.hash || '').slice(0, 12); }
// staff (admin and employees) sign in with a username and password stored as salted hashes in the Staff sheet
function ensureAdmin() {
  // the 123 admin is created once only; it never comes back even if the Staff sheet is emptied later
  var p = PropertiesService.getScriptProperties();
  if (p.getProperty('ADMIN_INIT')) return;
  p.setProperty('ADMIN_INIT', now());
  if (rows('Staff').length) return;
  var salt = Utilities.getUuid();
  saveRow('Staff', {username: FIRST_ADMIN_USER, name: 'المدير', role: 'admin', salt: salt, hash: hashPw(salt, FIRST_ADMIN_PASSWORD), status: ACC_ACTIVE, mustChange: 'نعم', lastLogin: ''});
}
function permsOf(x) { return x.role === 'admin' ? PERMS.slice() : String(x.perms || '').split(',').filter(function (p) { return PERMS.indexOf(p) >= 0; }); }
function can(p) { return STAFF.role === 'admin' || (p !== 'admin' && permsOf(STAFF).indexOf(p) >= 0); }
// which permission each staff action needs (the browser hides what an employee cannot do; this is the real check)
function permFor(r) {
  var a = r.action, sh = r.sheet;
  if (['staffUsers', 'staffSave', 'report', 'reportEmail', 'saveTheme', 'setLock', 'saveCatalog', 'marketAdmin', 'saveMarket', 'reviewSet', 'adsList', 'adsSave', 'adsDel', 'saveSite'].indexOf(a) >= 0) return 'admin';
  if (a === 'auditTrail') return 'finance';
  if (a === 'reply') return 'messages';
  if (a === 'sendEmail') return 'email';
  if (a === 'clientAccount') return 'accounts';
  if (a === 'upload') return 'files';
  if (a === 'reveal') return 'credentials';
  if (a === 'payment' || a === 'paymentDel') return 'finance';
  if (a === 'delete' && (sh === 'Payments' || sh === 'Expenses')) return 'finance';
  if (a === 'delete' && ['Coa', 'Journal', 'Budget'].indexOf(sh) >= 0) return 'finance';
  if (a === 'delete' && ['Leaves', 'Payroll', 'Evals'].indexOf(sh) >= 0) return 'hr';
  if (a === 'delete') return sh === 'Clients' || sh === 'Accounts' || sh === 'Log' ? 'admin' : 'delete';
  if (a === 'save') return {Clients: 'clients_edit', Transactions: 'transactions', Requests: 'requests', Files: 'files', Tasks: 'assign', Payments: 'finance', Expenses: 'finance',
    Coa: 'finance', Journal: 'finance', Budget: 'finance', Leaves: 'hr', Payroll: 'hr', Evals: 'hr'}[sh] || '';
  return '';
}
// the full employee file (HR): personal data, job and specialisation, documents with expiry dates, emergency contact, bank
var HR_FIELDS = {empNo: 30, department: 80, specialty: 120, skills: 400, qualification: 160, experience: 400, languages: 120, birthDate: 10, gender: 20, maritalStatus: 30,
  address: 200, workLocation: 80, manager: 40, probationEnd: 10, qidExpiry: 10, passportNo: 30, passportExpiry: 10, visaExpiry: 10, healthCardExpiry: 10, licenseExpiry: 10,
  emergencyName: 80, emergencyRelation: 40, emergencyPhone: 30, bankName: 80, iban: 40};
var HR_DOCS = {qidExpiry: 'البطاقة الشخصية', passportExpiry: 'جواز السفر', visaExpiry: 'الإقامة / تأشيرة العمل', healthCardExpiry: 'البطاقة الصحية', licenseExpiry: 'رخصة القيادة', contractEnd: 'عقد العمل'};
function hrFields(x, o) { Object.keys(HR_FIELDS).forEach(function (k) { o[k] = x[k] == null ? '' : x[k]; }); return o; }
function publicStaff(x) {
  return hrFields(x, {id: x.id, created: x.created, username: x.username, name: x.name, role: x.role, status: x.status, mustChange: x.mustChange ? 'نعم' : '', lastLogin: x.lastLogin,
    jobTitle: x.jobTitle, phone: x.phone, email: x.email, qid: x.qid, hireDate: x.hireDate, shiftStart: x.shiftStart, shiftEnd: x.shiftEnd, workDays: x.workDays, notes: x.notes, perms: permsOf(x),
    salary: x.salary, allowance: x.allowance, contractType: x.contractType, contractStart: x.contractStart, contractEnd: x.contractEnd, nationality: x.nationality, leaveDays: x.leaveDays});
}
function login(user, pw) {
  user = clean(user, 40).toLowerCase(); pw = String(pw || '');
  if (!user || !pw) return {ok: false, error: 'wrong_password'};
  if (cget('sl_' + user) >= STAFF_LOCK_FAILS) { watch('slk_' + user, 1, 'قُفل حساب إدارة بعد محاولات دخول خاطئة متكررة', user); return {ok: false, error: 'rate_limited'}; }
  Utilities.sleep(300);
  withLock(ensureAdmin);
  var st = rows('Staff').filter(function (x) { return String(x.username).toLowerCase() === user; })[0];
  if (!st || st.status !== ACC_ACTIVE || hashPw(st.salt, pw) !== st.hash) {
    var n = cinc('sl_' + user, STAFF_LOCK_SECONDS);
    secLog(n >= 3 ? 'medium' : 'low', 'كلمة مرور خاطئة في دخول الإدارة', user, st ? (st.status !== ACC_ACTIVE ? 'حساب موقوف' : 'المحاولة ' + n) : 'اسم مستخدم غير موجود');
    if (st && n === 5) secLog('high', 'محاولات دخول خاطئة متكررة على حساب إدارة', user, n + ' محاولات خلال 15 دقيقة');
    watch('gfail', 30, 'هجوم تخمين كلمات مرور على الخادم (محاولات فاشلة كثيرة)', 'كل الحسابات');
    return {ok: false, error: 'wrong_password'};
  }
  CacheService.getScriptCache().remove('sl_' + user);
  secLog(st.role === 'admin' ? 'info' : 'low', 'دخول ' + (st.role === 'admin' ? 'مدير' : 'موظف'), st.username, '');
  var sess = withLock(function () {
    st.lastLogin = now(); saveRow('Staff', st);
    // attendance: close any session left open (token expired or browser closed), then open a new one
    rows('Sessions').filter(function (x) { return x.staffId === st.id && !x.logout; }).forEach(function (x) { closeSession(x, 'انتهت دون خروج'); });
    return saveRow('Sessions', {staffId: st.id, username: st.username, login: now(), lastSeen: now(), logout: '', minutes: '', closedBy: ''});
  });
  return {ok: true, token: staffToken(st, sess.id), me: publicStaff(st)};
}
function staffToken(st, sid) {
  var exp = String(Date.now() + TOKEN_HOURS * 3600 * 1000), body = st.id + '.' + sid + '.' + exp;
  return 's.' + body + '.' + sign('s|' + body + '|' + tv(st));
}
function checkToken(t) {
  TOKEN_BAD = false;
  var p = String(t || '').split('.');
  if (p.length !== 5 || p[0] !== 's') { TOKEN_BAD = !!t; return null; }
  if (!(Number(p[3]) > Date.now())) return null;
  var st = rows('Staff').filter(function (x) { return x.id === p[1]; })[0];
  if (!st || p[4] !== sign('s|' + p[1] + '.' + p[2] + '.' + p[3] + '|' + tv(st))) { TOKEN_BAD = true; return null; }
  if (st.status !== ACC_ACTIVE) return null;
  SESSION = p[2];
  return st;
}
function mins(a, b) { var x = parseDate(a), y = parseDate(b); return x && y ? Math.max(0, Math.round((y - x) / 60000)) : 0; }
function parseDate(s) { if (!s) return null; var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?/); return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) : null; }
function closeSession(x, why) { x.logout = x.lastSeen || x.login; x.minutes = mins(x.login, x.logout); x.closedBy = why; saveRow('Sessions', x); }
// last activity is written at most every 5 minutes so an idle-closed session still shows its real working time
function touchSession() {
  if (!SESSION) return;
  var c = CacheService.getScriptCache(), k = 'ss_' + SESSION;
  if (c.get(k)) return;
  c.put(k, '1', 300);
  withLock(function () { var x = rows('Sessions').filter(function (y) { return y.id === SESSION; })[0]; if (x && !x.logout) { x.lastSeen = now(); saveRow('Sessions', x); } });
}
function staffLogout() {
  var x = rows('Sessions').filter(function (y) { return y.id === SESSION; })[0];
  if (x && !x.logout) { x.lastSeen = now(); x.logout = now(); x.minutes = mins(x.login, x.logout); x.closedBy = 'خروج'; saveRow('Sessions', x); }
  return {ok: true};
}
// every change a staff member makes is recorded for the admin's reports
function audit(action, sheetName, recordId, clientId, summary) {
  saveRow('Activity', {staffId: STAFF ? STAFF.id : '', username: STAFF ? STAFF.username : 'system', action: action, sheet: sheetName, recordId: recordId || '', clientId: clientId || '', summary: String(summary || '').slice(0, 300)});
}
function staffSaveRow(name, row) {
  var before = row.id ? rows(name).filter(function (x) { return x.id === row.id; })[0] : null;
  if (name === 'Transactions' && !can('finance')) {   // employees without the finance permission cannot see or change fees
    ['fee', 'govFee', 'paid'].forEach(function (k) { row[k] = before ? before[k] : ''; });
  }
  if (name === 'Transactions') row.paid = before ? before.paid : '';   // 'paid' is the total of the Payments rows (savePayment)
  if ((name === 'Transactions' || name === 'Requests') && !can('assign') && !can('admin')) { row.assignee = before ? before.assignee : STAFF.username; if (name === 'Requests') row.due = before ? before.due : ''; }
  if (name === 'Transactions') { row.progress = progressOf(row); if (['منجزة', 'ملغاة'].indexOf(row.status) >= 0 && !row.closed) row.closed = now().slice(0, 10); }
  if (name === 'Tasks') { if (!before) row.by = STAFF.username; row.progress = row.status === 'منجزة' ? 100 : Math.max(0, Math.min(100, Number(row.progress) || 0)); if (row.status === 'منجزة' && !row.done) row.done = now().slice(0, 10); }
  var lockD = prop('LOCK_DATE');   // entries dated in a closed period cannot be added or changed
  if (lockD && ['Expenses', 'Journal'].indexOf(name) >= 0 && (String(row.date || '') <= lockD || (before && String(before.date || '') <= lockD))) throw new Error('period_locked');
  if (lockD && name === 'Payroll' && before && before.status !== 'مدفوع' && row.status === 'مدفوع' && now().slice(0, 10) <= lockD) throw new Error('period_locked');
  if (name === 'Journal') { var jl = checkJournal(row.lines); if (!jl) throw new Error('unbalanced'); row.lines = JSON.stringify(jl); if (!before) row.by = STAFF.username; }
  if (name === 'Leaves') { row.days = leaveDays(row.from, row.to); if (LEAVE_TYPES.indexOf(row.type) < 0) row.type = 'أخرى';
    if (!before || before.status !== row.status) row.decidedBy = row.status === 'بانتظار الموافقة' ? '' : STAFF.username; }
  if (name === 'Payroll') {
    row.net = Math.round(((Number(row.basic) || 0) + (Number(row.allowances) || 0) - (Number(row.deductions) || 0)) * 100) / 100;
    if (!before) row.by = STAFF.username;
    if (before && before.status === 'مدفوع') ['basic', 'allowances', 'deductions', 'net', 'month', 'username', 'expenseId'].forEach(function (k) { row[k] = before[k]; });   // a paid salary is locked
    if (row.status === 'مدفوع' && !row.expenseId) {   // paying a salary records it as an expense (and so in the accounts)
      if (!row.paidDate) row.paidDate = now().slice(0, 10);
      var ex = saveRow('Expenses', {date: row.paidDate, category: 'رواتب', amount: row.net, txnId: '', clientId: '', note: 'راتب ' + row.username + ' ' + row.month, by: STAFF.username, account: '1102'});
      row.expenseId = ex.id;
    }
  }
  if (name === 'Evals') { if (!before) row.by = STAFF.username; var sc = {}; try { sc = typeof row.scores === 'string' ? JSON.parse(row.scores || '{}') : (row.scores || {}); } catch (e) { sc = {}; }
    var vals = Object.keys(sc).map(function (k) { return Math.max(1, Math.min(5, Number(sc[k]) || 1)); }); row.scores = JSON.stringify(sc);
    row.total = vals.length ? Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length * 20) : 0; }
  if (name === 'Files') {   // a file row may only be relabelled; its Drive file and owner stay as uploaded
    row.fileId = before ? before.fileId : '';
    if (before && before.fileId) { row.url = before.url; row.clientId = before.clientId; }
    else if (row.url && !/^https?:\/\//i.test(String(row.url))) row.url = '';
  }
  var r = saveRow(name, row);
  if (['Transactions', 'Requests', 'Tasks'].indexOf(name) >= 0 && r.assignee && (!before || before.assignee !== r.assignee)) notifyAssignee(name, r);
  if (name === 'Log') return r;
  var what = {Clients: 'عميل', Transactions: 'معاملة', Requests: 'طلب', Files: 'ملف', Tasks: 'مهمة', Expenses: 'مصروف'}[name] || name;
  var label = r.service || r.name || r.title || r.category || r.id, summary;
  if (!before) summary = 'إضافة ' + what + ': ' + label + (r.status ? ' · ' + r.status : '') + (r.assignee ? ' · المسؤول ' + r.assignee : '');
  else if (r.assignee && before.assignee !== r.assignee) summary = 'تكليف ' + r.assignee + ' بـ' + what + ' ' + r.id + ' (' + label + ')';
  else if (before.status !== r.status && r.status) summary = what + ' ' + r.id + ' (' + label + '): ' + (before.status || '') + ' ← ' + r.status;
  else summary = 'تعديل ' + what + ' ' + r.id + ' (' + label + ')';
  audit(!before ? 'create' : (r.assignee && before.assignee !== r.assignee ? 'assign' : (before.status !== r.status ? 'status' : 'edit')), name, r.id, name === 'Clients' ? r.id : r.clientId, summary);
  return r;
}
// ---------- work distribution: progress, the employee's own updates, notices ----------
var TX_PROGRESS = {'جديدة': 5, 'بانتظار المستندات': 15, 'قيد التقديم': 45, 'قيد المتابعة لدى الجهة': 70, 'بانتظار العميل': 60, 'منجزة': 100, 'ملغاة': 0};
function progressOf(t) {
  if (t.status === 'منجزة') return 100;
  var n = Number(t.progress);
  return t.progress !== '' && t.progress != null && !isNaN(n) ? Math.max(0, Math.min(99, Math.round(n))) : (TX_PROGRESS[t.status] || 0);
}
// an employee updates the progress, status and notes of work assigned to them, whatever their other permissions
function myUpdate(r) {
  var name = {Transactions: 'Transactions', Tasks: 'Tasks', Requests: 'Requests'}[r.sheet];
  if (!name) return {ok: false, error: 'invalid'};
  var row = rows(name).filter(function (x) { return x.id === r.id; })[0];
  if (!row) return {ok: false, error: 'not_found'};
  var mine = String(row.assignee) === STAFF.username;
  if (!mine && !can('assign') && !can(name === 'Tasks' ? 'assign' : (name === 'Requests' ? 'requests' : 'transactions'))) return {ok: false, error: 'no_permission'};
  var before = row.status, note = clean(r.note, 1000);
  if (r.status != null) {
    var allowed = name === 'Tasks' ? TASK_ST : (name === 'Requests' ? ['جديد', 'تم التواصل', 'تحوّل إلى معاملة', 'مغلق'] : Object.keys(TX_PROGRESS));
    if (allowed.indexOf(r.status) < 0) return {ok: false, error: 'invalid'};
    row.status = r.status;
  }
  if (r.progress != null && name !== 'Requests') row.progress = Math.max(0, Math.min(100, Math.round(Number(r.progress) || 0)));
  if (name === 'Transactions') { row.progress = progressOf(row); if (['منجزة', 'ملغاة'].indexOf(row.status) >= 0 && !row.closed) row.closed = now().slice(0, 10); }
  if (name === 'Tasks') { if (row.status === 'منجزة') { row.progress = 100; if (!row.done) row.done = now().slice(0, 10); } if (note) row.notes = (row.notes ? row.notes + '\n' : '') + now() + ' · ' + STAFF.username + ': ' + note; }
  saveRow(name, row);
  var label = row.service || row.title || row.name || row.id;
  if (name !== 'Tasks' && (note || before !== row.status)) saveRow('Log', {clientId: row.clientId || '', txnId: name === 'Transactions' ? row.id : '', kind: before !== row.status ? 'status' : 'note',
    subject: label + (before !== row.status ? ': ' + before + ' ← ' + row.status : ''), body: note, by: STAFF.username});
  audit(before !== row.status ? 'status' : 'progress', name, row.id, row.clientId || '', ({Transactions: 'معاملة', Tasks: 'مهمة', Requests: 'طلب'})[name] + ' ' + row.id + ' (' + label + '): ' +
    (before !== row.status ? before + ' ← ' + row.status : 'الإنجاز ' + (row.progress || 0) + '%') + (note ? ' · ' + note.slice(0, 80) : ''));
  return {ok: true, row: name === 'Transactions' && !can('finance') ? stripFees(row) : row};
}
// site colours chosen by the manager; every page reads them through the public 'theme' action. null = the default colours
function saveTheme(t) {
  var p = PropertiesService.getScriptProperties();
  if (!t) { p.deleteProperty('THEME'); audit('settings', '', '', '', 'ألوان الموقع: الألوان الافتراضية'); return {ok: true, theme: null}; }
  var hex = function (x) { return /^#[0-9a-fA-F]{6}$/.test(String(x || '')); };
  if (!hex(t.primary) || !hex(t.accent)) return {ok: false, error: 'invalid'};
  var th = {primary: t.primary.toLowerCase(), accent: t.accent.toLowerCase(), name: clean(t.name, 60)};
  p.setProperty('THEME', JSON.stringify(th));
  audit('settings', '', '', '', 'ألوان الموقع: ' + (th.name || th.primary + ' / ' + th.accent));
  return {ok: true, theme: th};
}
// site texts edited in the admin panel (الإعدادات ← نصوص الموقع): plain text only, shown on every public page. null = the page's own texts
var SITE_KEYS = {brand: 60, eyebrow: 80, h1: 120, h1em: 80, lead: 400, p1t: 60, p1s: 160, p2t: 60, p2s: 160, p3t: 60, p3s: 160, about: 600};
function saveSite(s) {
  var p = PropertiesService.getScriptProperties();
  var old = {}; try { old = JSON.parse(p.getProperty('SITE_TEXT') || '{}') || {}; } catch (e) { old = {}; }
  // a changed public phone, WhatsApp or email could send clients elsewhere: alert the owner at once with old and new values
  var contactLog = function (nw) { var ch = [];
    [['wa', 'واتساب'], ['phone', 'الهاتف'], ['email', 'البريد']].forEach(function (x) { var o = old[x[0]] || '', v = nw[x[0]] || ''; if (o !== v) ch.push(x[1] + ': ' + (o || 'الأصلي') + ' ← ' + (v || 'الأصلي')); });
    if (ch.length) secLog('high', 'تغيير بيانات التواصل العامة في الموقع', STAFF.username, ch.join('، ')); };
  if (!s) { p.deleteProperty('SITE_TEXT'); audit('settings', '', '', '', 'نصوص الموقع: النصوص الأصلية'); secLog('medium', 'تغيير نصوص الموقع العامة', STAFF.username, 'العودة إلى الأصل'); contactLog({}); return {ok: true, site: null}; }
  var out = {ar: {}, en: {}}, n = 0;
  ['ar', 'en'].forEach(function (l) { var src = (s[l] && typeof s[l] === 'object') ? s[l] : {};
    Object.keys(SITE_KEYS).forEach(function (k) { var v = String(src[k] == null ? '' : src[k]).replace(/[<>"`]/g, '').replace(/\s+/g, ' ').trim().slice(0, SITE_KEYS[k]); if (v) { out[l][k] = v; n++; } }); });
  var dg = function (x) { x = String(x || '').replace(/\D/g, ''); return /^\d{8,15}$/.test(x) ? x : ''; };
  out.wa = dg(s.wa); out.phone = dg(s.phone);
  var em = String(s.email || '').trim().slice(0, 120); out.email = /^[^\s@<>"`]+@[^\s@<>"`]+\.[^\s@<>"`]+$/.test(em) ? em : '';
  if ((s.wa && !out.wa) || (s.phone && !out.phone) || (s.email && !out.email)) return {ok: false, error: 'invalid'};
  p.setProperty('SITE_TEXT', JSON.stringify(out));
  audit('settings', '', '', '', 'نصوص الموقع: حفظ (' + n + ' نص)' + (out.wa || out.phone || out.email ? ' مع بيانات التواصل' : ''));
  secLog('medium', 'تغيير نصوص الموقع العامة', STAFF.username, n + ' نص' + (out.wa || out.phone || out.email ? ' وبيانات التواصل' : ''));
  contactLog(out);
  return {ok: true, site: out};
}
// services, prices and packages edited in the admin panel (الإعدادات ← الخدمات والأسعار). The public site reads them through the
// public 'catalog' action; with nothing saved, the site keeps its built-in data.js and details.js.
// Stored as JSON split into 40,000-character pieces in the sheet "Catalog" (a cell holds at most 50,000).
var CAT_CHUNK = 40000;
function catalogGet(ver) {
  var v = prop('CATALOG_VER'), n = +prop('CATALOG_N') || 0;
  if (!v || !n) return {ok: true, ver: ''};
  if (ver && ver === v) return {ok: true, ver: v, same: true};
  var sh = SpreadsheetApp.getActive().getSheetByName('Catalog');
  if (!sh) return {ok: true, ver: ''};
  var txt = sh.getRange(1, 2, n, 1).getValues().map(function (r) { return String(r[0]).replace(/^~/, ''); }).join('');
  try { var c = JSON.parse(txt); return {ok: true, ver: v, data: c.data, details: c.details}; } catch (e) { return {ok: true, ver: ''}; }
}
// every text in the catalog loses < > " and ` and is capped at 2,000 characters (it is shown on public pages)
function catClean(v) {
  if (typeof v === 'string') return v.replace(/[<>"`]/g, '').slice(0, 2000);
  if (Array.isArray(v)) return v.map(catClean);
  if (v && typeof v === 'object') { var o = {}; Object.keys(v).forEach(function (k) { o[catClean(k)] = catClean(v[k]); }); return o; }
  return v;
}
function catalogSave(c) {
  var p = PropertiesService.getScriptProperties();
  if (!c) { p.deleteProperty('CATALOG_VER'); p.deleteProperty('CATALOG_N'); audit('settings', '', '', '', 'الخدمات والأسعار: العودة إلى القائمة الأصلية'); return {ok: true, ver: ''}; }
  var d = c.data || {};
  if (!d.G || !d.G.length || !d.PLANS || !d.SETUP || !d.CONSULT || !c.details) return {ok: false, error: 'invalid'};
  var codes = {}, dup = '';
  d.G.forEach(function (g) { (g[2] || []).forEach(function (x) { if (codes[x[0]]) dup = x[0]; codes[x[0]] = 1; }); });
  d.SETUP.forEach(function (x) { if (codes[x[0]]) dup = x[0]; codes[x[0]] = 1; });
  d.CONSULT.forEach(function (k) { (k.items || []).forEach(function (x) { if (codes[x.c]) dup = x.c; codes[x.c] = 1; }); });
  if (dup) return {ok: false, error: 'duplicate_code', code: dup};
  var txt = JSON.stringify({data: catClean(d), details: catClean(c.details)}), parts = [];   // shown on public pages: no markup
  if (txt.length > 2000000) return {ok: false, error: 'too_large'};
  // each piece starts with ~ so the sheet never reads one as a formula (a piece could begin with = + - @); catalogGet removes it
  for (var i = 0; i < txt.length; i += CAT_CHUNK) parts.push([parts.length + 1, '~' + txt.slice(i, i + CAT_CHUNK)]);
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName('Catalog') || ss.insertSheet('Catalog');
  sh.getRange(1, 1, parts.length, 2).setValues(parts);
  var v = String(new Date().getTime());
  p.setProperty('CATALOG_N', String(parts.length)); p.setProperty('CATALOG_VER', v);
  audit('settings', '', '', '', 'الخدمات والأسعار: حفظ ونشر (' + Object.keys(codes).length + ' خدمة)');
  secLog('medium', 'تغيير الخدمات والأسعار المعروضة في الموقع', STAFF.username, Object.keys(codes).length + ' خدمة');
  return {ok: true, ver: v};
}
// the marketplace catalogue edited in the admin panel (لوحة الإدارة ← المواد): categories, items, ready baskets and their public
// details go to the public 'market' action; cost, partners, stock and internal notes ("priv") are returned to staff only.
// Both are kept as JSON in 40,000-character pieces, in the sheets "Market" and "MarketPrivate".
function chunkRead(name, n) {
  var sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh || !n) return null;
  var txt = sh.getRange(1, 2, n, 1).getValues().map(function (r) { return String(r[0]).replace(/^~/, ''); }).join('');
  try { return JSON.parse(txt); } catch (e) { return null; }
}
function chunkWrite(name, obj) {
  var txt = JSON.stringify(obj), parts = [];
  if (txt.length > 3000000) return 0;
  for (var i = 0; i < txt.length; i += CAT_CHUNK) parts.push([parts.length + 1, '~' + txt.slice(i, i + CAT_CHUNK)]);
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clearContents(); sh.getRange(1, 1, parts.length, 2).setValues(parts);
  return parts.length;
}
function marketGet(ver, staff) {
  var v = prop('MARKET_VER'), n = +prop('MARKET_N') || 0;
  if (!v || !n) return {ok: true, ver: ''};
  if (!staff && ver && ver === v) return {ok: true, ver: v, same: true};
  var m = chunkRead('Market', n);
  if (!m) return {ok: true, ver: ''};
  var out = {ok: true, ver: v, market: m};
  if (staff) out.priv = chunkRead('MarketPrivate', +prop('MARKET_PN') || 0) || {};
  return out;
}
// like catClean, except that an item picture ("img") may be an https link or a small uploaded jpeg, png or webp
function marketClean(v, key) {
  if (key === 'img') return typeof v === 'string' && v.length <= 120000 && /^(https:\/\/[^\s<>"`]+|data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+\/=]+)$/.test(v) ? v : '';
  if (typeof v === 'string') return v.replace(/[<>"`]/g, '').slice(0, 2000);
  if (Array.isArray(v)) return v.map(function (x) { return marketClean(x); });
  if (v && typeof v === 'object') { var o = {}; Object.keys(v).forEach(function (k) { o[catClean(k)] = marketClean(v[k], k); }); return o; }
  return v;
}
function marketSave(m, priv) {
  var p = PropertiesService.getScriptProperties();
  if (!m) { p.deleteProperty('MARKET_VER'); p.deleteProperty('MARKET_N'); audit('settings', '', '', '', 'المواد: العودة إلى الكتالوج الأصلي'); return {ok: true, ver: ''}; }
  if (!m.CATS || !m.CATS.length) return {ok: false, error: 'invalid'};
  var codes = {}, dup = '';
  m.CATS.forEach(function (c) { (c.items || []).forEach(function (x) { if (codes[x[0]]) dup = x[0]; codes[x[0]] = 1; }); });
  (m.BASKETS || []).forEach(function (b) { if (codes[b.code]) dup = b.code; codes[b.code] = 1; });
  if (dup) return {ok: false, error: 'duplicate_code', code: dup};
  var n = chunkWrite('Market', marketClean(m));
  if (!n) return {ok: false, error: 'too_large'};
  var pn = chunkWrite('MarketPrivate', catClean(priv || {}));
  var v = String(new Date().getTime());
  p.setProperty('MARKET_N', String(n)); p.setProperty('MARKET_PN', String(pn)); p.setProperty('MARKET_VER', v);
  audit('settings', '', '', '', 'المواد: حفظ ونشر (' + Object.keys(codes).length + ' صنف وسلة)');
  secLog('medium', 'تغيير أصناف وأسعار السوق المعروضة في الموقع', STAFF.username, Object.keys(codes).length + ' صنف وسلة');
  return {ok: true, ver: v};
}
// ---------- accounting and HR helpers ----------
function checkJournal(lines) {
  try { lines = typeof lines === 'string' ? JSON.parse(lines) : lines; } catch (e) { return null; }
  if (!Array.isArray(lines) || lines.length < 2) return null;
  var dr = 0, cr = 0, out = [];
  lines.forEach(function (l) { var d = Math.round((Number(l.dr) || 0) * 100) / 100, c = Math.round((Number(l.cr) || 0) * 100) / 100;
    if (!/^\d{3,6}$/.test(String(l.a || '')) || (d && c) || (!d && !c) || d < 0 || c < 0) return; dr += d; cr += c; out.push({a: String(l.a), dr: d, cr: c}); });
  return out.length >= 2 && out.length === lines.length && Math.abs(dr - cr) < 0.005 ? out : null;
}
function leaveDays(from, to) { var a = parseDate(from), b = parseDate(to); return a && b && b >= a ? Math.round((b - a) / 86400000) + 1 : 0; }
// an employee asks for leave; HR approves or refuses it
function myLeave(r) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(r.from || '')) || !/^\d{4}-\d{2}-\d{2}$/.test(String(r.to || '')) || leaveDays(r.from, r.to) < 1) return {ok: false, error: 'invalid'};
  var row = saveRow('Leaves', {username: STAFF.username, type: LEAVE_TYPES.indexOf(r.type) >= 0 ? r.type : 'أخرى', from: r.from, to: r.to, days: leaveDays(r.from, r.to), status: 'بانتظار الموافقة', note: clean(r.note, 300), decidedBy: ''});
  audit('leave', 'Leaves', row.id, '', 'طلب إجازة ' + row.type + ' ' + row.from + ' إلى ' + row.to + ' (' + row.days + ' يوم)');
  var to = prop('OFFICE_EMAIL');
  if (to) try { MailApp.sendEmail({to: to, name: 'نظام جاهز', subject: 'طلب إجازة من ' + (STAFF.name || STAFF.username), htmlBody: shell('<p>' + escHtml(STAFF.name || STAFF.username) + ' طلب إجازة ' + row.type + ' من ' + row.from + ' إلى ' + row.to + ' (' + row.days + ' يوم).</p>' + (row.note ? '<p>' + escHtml(row.note) + '</p>' : '') + '<p>للموافقة: لوحة الإدارة ← الموارد البشرية ← الإجازات.</p>')}); } catch (err) {}
  return {ok: true, row: row};
}
// closing a period: nothing dated on or before the lock date can be added, changed or deleted. '' reopens everything.
function setLock(d) {
  if (d && !/^\d{4}-\d{2}-\d{2}$/.test(String(d))) return {ok: false, error: 'invalid'};
  var p = PropertiesService.getScriptProperties(), was = p.getProperty('LOCK_DATE') || '';
  if (was && (!d || d < was)) secLog('medium', 'فتح فترة مالية مقفلة', STAFF.username, 'من ' + was + ' إلى ' + (d || 'بلا إقفال'));
  if (d) p.setProperty('LOCK_DATE', d); else p.deleteProperty('LOCK_DATE');
  audit('lock', '', '', '', d ? 'إقفال الفترة المالية حتى ' + d : 'فتح الفترات المالية المقفلة');
  return {ok: true, lock: d || ''};
}
// who recorded or changed what in the money sheets
function auditTrail(from, to) {
  from = /^\d{4}-\d{2}-\d{2}$/.test(from || '') ? from : '0000-00-00'; to = /^\d{4}-\d{2}-\d{2}$/.test(to || '') ? to : '9999-99-99';
  var fin = ['Payments', 'Expenses', 'Journal', 'Coa', 'Budget', 'Payroll', 'Transactions'];
  return {ok: true, rows: rows('Activity').filter(function (x) { var d = String(x.created).slice(0, 10); return d >= from && d <= to && (fin.indexOf(x.sheet) >= 0 || ['payment', 'lock'].indexOf(x.action) >= 0); })
    .slice(-1000).reverse().map(function (x) { return pick(x, ['created', 'username', 'action', 'sheet', 'recordId', 'clientId', 'summary']); })};
}
function stripFees(t) { var c = {}; Object.keys(t).forEach(function (k) { if (['fee', 'govFee', 'paid'].indexOf(k) < 0) c[k] = t[k]; }); return c; }
function notifyAssignee(name, r) {
  var st = rows('Staff').filter(function (x) { return x.username === r.assignee && x.status === ACC_ACTIVE; })[0];
  if (!st || !st.email || st.username === (STAFF || {}).username) return;
  var what = {Transactions: 'معاملة', Requests: 'طلب عميل', Tasks: 'مهمة'}[name], label = r.service || r.title || r.services || r.name || r.id;
  var c = r.clientId ? rows('Clients').filter(function (x) { return x.id === r.clientId; })[0] : null;
  try { MailApp.sendEmail({to: st.email, name: 'نظام جاهز', subject: 'كُلّفت بـ' + what + ' ' + r.id + ': ' + String(label).slice(0, 80),
    htmlBody: shell('<p>السلام عليكم ' + escHtml(st.name || st.username) + '،</p><p>كلّفك ' + escHtml((STAFF || {}).name || (STAFF || {}).username || 'المدير') + ' بـ' + what + ' <b>' + r.id + '</b>: ' + escHtml(String(label).slice(0, 300)) +
      (c ? '<br>العميل: ' + escHtml(c.name) : '') + (r.dueDate || r.due ? '<br>الموعد: ' + (r.dueDate || r.due) : '') + '</p><p>افتح لوحة الإدارة ← «مهامي» لمتابعتها وتحديث نسبة الإنجاز.</p>')}); } catch (err) {}
}
// ---------- fees: payments recorded against a transaction ----------
function savePayment(p) {
  var t = rows('Transactions').filter(function (x) { return x.id === p.txnId; })[0];
  if (!t) return {ok: false, error: 'not_found'};
  var amount = Math.round(Number(p.amount) * 100) / 100;
  if (!(amount > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(String(p.date || ''))) return {ok: false, error: 'invalid'};
  var before = p.id ? rows('Payments').filter(function (x) { return x.id === p.id; })[0] : null;
  if (p.id && !before) return {ok: false, error: 'not_found'};
  var lockD = prop('LOCK_DATE'); if (lockD && (String(p.date) <= lockD || (before && String(before.date) <= lockD))) return {ok: false, error: 'period_locked'};
  var row = saveRow('Payments', {id: p.id || '', created: before ? before.created : '', clientId: t.clientId, txnId: t.id, date: p.date, amount: amount,
    method: PAY_METHODS.indexOf(p.method) >= 0 ? p.method : 'أخرى', receiptNo: clean(p.receiptNo, 40), note: clean(p.note, 300), by: STAFF.username});
  if (!row.receiptNo) { row.receiptNo = 'RC-' + row.id.replace(/\D/g, ''); saveRow('Payments', row); }
  syncPaid(t);
  audit('payment', 'Payments', row.id, t.clientId, (before ? 'تعديل دفعة ' : 'تسجيل دفعة ') + row.amount + ' ر.ق · ' + row.method + ' · المعاملة ' + t.id + ' (' + t.service + ')');
  saveRow('Log', {clientId: t.clientId, txnId: t.id, kind: 'payment', subject: 'دفعة ' + row.amount + ' ر.ق (' + row.method + ') · سند ' + row.receiptNo, body: row.note, by: STAFF.username});
  return {ok: true, row: row, txn: rows('Transactions').filter(function (x) { return x.id === t.id; })[0]};
}
function deletePayment(id) {
  var p = rows('Payments').filter(function (x) { return x.id === id; })[0];
  if (!p) return {ok: false, error: 'not_found'};
  if (prop('LOCK_DATE') && String(p.date) <= prop('LOCK_DATE')) return {ok: false, error: 'period_locked'};
  deleteRow('Payments', id);
  var t = rows('Transactions').filter(function (x) { return x.id === p.txnId; })[0];
  if (t) syncPaid(t);
  audit('delete', 'Payments', id, p.clientId, 'حذف دفعة ' + p.amount + ' ر.ق · سند ' + p.receiptNo + ' · المعاملة ' + p.txnId);
  return {ok: true, txn: t || null};
}
function syncPaid(t) {
  var sum = rows('Payments').filter(function (x) { return x.txnId === t.id; }).reduce(function (a, x) { return a + (Number(x.amount) || 0); }, 0);
  t.paid = Math.round(sum * 100) / 100; saveRow('Transactions', t);
}

function staffChangeOwn(r) {
  var st = STAFF;
  if (hashPw(st.salt, String(r.old || '')) !== st.hash) return {ok: false, error: 'wrong_password'};
  if (r.username != null) {
    var u = clean(r.username, 40).toLowerCase();
    if (!/^[^\s]{3,40}$/.test(u)) return {ok: false, error: 'bad_username'};
    if (rows('Staff').some(function (x) { return String(x.username).toLowerCase() === u && x.id !== st.id; })) return {ok: false, error: 'username_taken'};
    st.username = u;
  }
  if (r.password) {
    if (!validPw(r.password)) return {ok: false, error: 'weak_password'};
    st.salt = Utilities.getUuid(); st.hash = hashPw(st.salt, r.password);
  }
  if (st.mustChange && (!r.password || st.username === FIRST_ADMIN_USER)) return {ok: false, error: 'must_change_both'};
  st.mustChange = '';
  saveRow('Staff', st);
  saveRow('Log', {kind: 'account', subject: 'الموظف ' + st.username + ' حدّث بيانات دخوله', body: '', by: st.username});
  secLog(st.role === 'admin' ? 'medium' : 'low', 'تغيير بيانات دخول ' + (st.role === 'admin' ? 'مدير' : 'موظف'), st.username, '');
  return {ok: true, me: publicStaff(st), token: staffToken(st, SESSION)};   // the old session ended with the old password
}
function staffSave(r) {
  var all = rows('Staff'), st = r.id ? all.filter(function (x) { return x.id === r.id; })[0] : null;
  if (r.id && !st) return {ok: false, error: 'not_found'};
  var isNew = !st, wasAdmin = !!st && st.role === 'admin';
  st = st || {status: ACC_ACTIVE, lastLogin: ''};
  var u = clean(r.username != null ? r.username : st.username, 40).toLowerCase();
  if (!/^[^\s]{3,40}$/.test(u)) return {ok: false, error: 'bad_username'};
  if (all.some(function (x) { return String(x.username).toLowerCase() === u && x.id !== st.id; })) return {ok: false, error: 'username_taken'};
  st.username = u;
  ['name', 'jobTitle', 'phone', 'email', 'qid', 'hireDate', 'shiftStart', 'shiftEnd', 'workDays', 'notes', 'contractType', 'contractStart', 'contractEnd', 'nationality'].forEach(function (k) { if (r[k] != null) st[k] = clean(r[k], k === 'notes' ? 500 : 80); });
  var bankBefore = isNew ? '' : String(st.iban || '') + '|' + String(st.bankName || '');
  Object.keys(HR_FIELDS).forEach(function (k) { if (r[k] == null) return; var v = clean(r[k], HR_FIELDS[k]);
    if (HR_FIELDS[k] === 10 && v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) v = '';   // dates only as yyyy-mm-dd
    if (k === 'iban') v = v.replace(/\s/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    st[k] = v; });
  ['salary', 'allowance', 'leaveDays'].forEach(function (k) { if (r[k] != null && r[k] !== '') st[k] = Math.max(0, Number(r[k]) || 0); else if (r[k] === '') st[k] = ''; });
  if (r.role === 'admin' || r.role === 'staff') st.role = r.role;
  if (!st.role) st.role = 'staff';
  if (r.perms) st.perms = (Array.isArray(r.perms) ? r.perms : String(r.perms).split(',')).filter(function (p) { return PERMS.indexOf(p) >= 0; }).join(',');
  if ([ACC_ACTIVE, ACC_OFF].indexOf(r.status) >= 0) st.status = r.status;
  if (r.password) { if (!validPw(r.password)) return {ok: false, error: 'weak_password'}; st.salt = Utilities.getUuid(); st.hash = hashPw(st.salt, r.password); st.mustChange = 'نعم'; }
  if (!st.hash) return {ok: false, error: 'weak_password'};
  var admins = all.filter(function (x) { return x.role === 'admin' && x.status === ACC_ACTIVE && x.id !== st.id; });
  if (!admins.length && (st.role !== 'admin' || st.status !== ACC_ACTIVE)) return {ok: false, error: 'last_admin'};
  st = saveRow('Staff', st);
  if (st.status !== ACC_ACTIVE) rows('Sessions').filter(function (x) { return x.staffId === st.id && !x.logout; }).forEach(function (x) { closeSession(x, 'أوقفه المدير'); });
  if (!isNew && bankBefore !== String(st.iban || '') + '|' + String(st.bankName || '')) secLog('high', 'تغيير الحساب البنكي لموظف', st.username, 'بواسطة ' + STAFF.username);   // a classic payroll fraud
  if (st.role === 'admin' && !wasAdmin) secLog('high', isNew ? 'إضافة مدير جديد بكل الصلاحيات' : 'ترقية موظف إلى مدير بكل الصلاحيات', st.username, 'بواسطة ' + STAFF.username);
  else if (isNew) secLog('medium', 'إضافة موظف جديد', st.username, 'بواسطة ' + STAFF.username);
  if (!isNew && r.password) secLog('medium', 'المدير عيّن كلمة مرور جديدة لموظف', st.username, 'بواسطة ' + STAFF.username);
  audit(isNew ? 'staff_create' : 'staff_edit', 'Staff', st.id, '', (isNew ? 'إضافة موظف: ' : 'تعديل موظف: ') + st.username + ' · ' + (st.role === 'admin' ? 'مدير' : 'موظف') + ' · ' + st.status + (r.password ? ' · كلمة مرور مؤقتة' : ''));
  return {ok: true, row: publicStaff(st)};
}

// ---------- staff reports: attendance and work done in a period ----------
function staffReport(from, to) {
  from = /^\d{4}-\d{2}-\d{2}$/.test(from || '') ? from : now().slice(0, 10);
  to = /^\d{4}-\d{2}-\d{2}$/.test(to || '') ? to : from;
  var inRange = function (d) { d = String(d || '').slice(0, 10); return d >= from && d <= to; };
  var sessions = rows('Sessions').filter(function (x) { return inRange(x.login); });
  var acts = rows('Activity').filter(function (x) { return inRange(x.created); });
  var msgs = rows('Messages').filter(function (m) { return m.from === 'office' && inRange(m.created); });
  var staff = rows('Staff').map(function (st) {
    var ss = sessions.filter(function (x) { return x.staffId === st.id; }), aa = acts.filter(function (x) { return x.staffId === st.id; });
    var days = {};
    ss.forEach(function (x) {
      var d = String(x.login).slice(0, 10), m = x.logout ? Number(x.minutes) || 0 : mins(x.login, x.lastSeen || x.login);
      var o = days[d] = days[d] || {date: d, first: x.login.slice(11), last: '', minutes: 0, sessions: 0, open: false};
      if (x.login.slice(11) < o.first) o.first = x.login.slice(11);
      var end = String(x.logout || x.lastSeen || '').slice(11); if (end > o.last) o.last = end;
      o.minutes += m; o.sessions++; if (!x.logout) o.open = true;
    });
    var dayList = Object.keys(days).sort().map(function (d) { var o = days[d]; o.late = !!(st.shiftStart && o.first > addMin(st.shiftStart, 15)); o.early = !!(st.shiftEnd && o.last && !o.open && o.last < st.shiftEnd); return o; });
    var count = function (f) { return aa.filter(f).length; };
    return {id: st.id, username: st.username, name: st.name, jobTitle: st.jobTitle, role: st.role, shiftStart: st.shiftStart, shiftEnd: st.shiftEnd,
      days: dayList, minutes: dayList.reduce(function (a, o) { return a + o.minutes; }, 0), late: dayList.filter(function (o) { return o.late; }).length,
      actions: aa.length, txCreated: count(function (x) { return x.sheet === 'Transactions' && x.action === 'create'; }),
      txDone: count(function (x) { return x.sheet === 'Transactions' && x.action === 'status' && /← منجزة$/.test(x.summary); }),
      statusChanges: count(function (x) { return x.action === 'status'; }), replies: msgs.filter(function (m) { return m.by === st.username; }).length,
      files: count(function (x) { return x.action === 'file'; }), emails: count(function (x) { return x.action === 'email'; }),
      clientsAdded: count(function (x) { return x.sheet === 'Clients' && x.action === 'create'; }),
      log: aa.slice(-200).reverse().map(function (x) { return {created: x.created, action: x.action, summary: x.summary, clientId: x.clientId}; })};
  });
  return {ok: true, from: from, to: to, staff: staff};
}
function addMin(hhmm, n) { var m = String(hhmm).match(/^(\d{1,2}):(\d{2})/); if (!m) return '99:99'; var t = +m[1] * 60 + +m[2] + n; return ('0' + Math.floor(t / 60)).slice(-2) + ':' + ('0' + t % 60).slice(-2); }
function hm(m) { m = Number(m) || 0; return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); }
function reportHtml(rep) {
  var rowsHtml = rep.staff.map(function (s) {
    return '<tr><td>' + escHtml(s.name || s.username) + '</td><td>' + s.days.length + '</td><td>' + hm(s.minutes) + '</td><td>' + s.late + '</td><td>' + s.actions + '</td><td>' + s.txCreated + '</td><td>' + s.txDone + '</td><td>' + s.replies + '</td><td>' + s.files + '</td></tr>';
  }).join('');
  return '<p>تقرير الموظفين من ' + rep.from + ' إلى ' + rep.to + '</p><table border="1" cellpadding="6" style="border-collapse:collapse;font-size:14px"><tr><th>الموظف</th><th>أيام الحضور</th><th>ساعات العمل</th><th>تأخير</th><th>الإجراءات</th><th>معاملات أُضيفت</th><th>معاملات أُنجزت</th><th>ردود على العملاء</th><th>ملفات رُفعت</th></tr>' + rowsHtml + '</table>';
}
function emailReport(from, to) {
  var rep = staffReport(from, to), dest = prop('OFFICE_EMAIL');
  if (!dest) return {ok: false, error: 'invalid'};
  MailApp.sendEmail({to: dest, name: 'نظام جاهز', subject: 'تقرير الموظفين ' + rep.from + (rep.to !== rep.from ? ' إلى ' + rep.to : ''), htmlBody: shell(reportHtml(rep))});
  return {ok: true, to: dest};
}

// ---------- sheet helpers ----------
function sheet(name) {
  if (!SHEETS[name]) throw new Error('bad_sheet');
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) {   // sheets added in a later version are created on first use
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, SHEETS[name].length).setValues([SHEETS[name]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  } else if (!HEAD_OK[name]) {   // a newer version added columns at the end: write the missing headers once
    var w = SHEETS[name].length, head = sh.getRange(1, 1, 1, w).getValues()[0];
    if (String(head[w - 1]) !== SHEETS[name][w - 1]) sh.getRange(1, 1, 1, w).setValues([SHEETS[name]]).setFontWeight('bold');
  }
  HEAD_OK[name] = true;
  return sh;
}
var HEAD_OK = {};
function rows(name) {
  var sh = sheet(name), cols = SHEETS[name], n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, cols.length).getValues().map(function (r) {
    var o = {}; cols.forEach(function (c, i) { var v = r[i]; o[c] = v instanceof Date ? Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd') : (typeof v === 'string' && /^'[=+\-@]/.test(v) ? v.slice(1) : v); }); return o;
  }).filter(function (o) { return o.id; });
}
function listAll() {
  var o = {}; Object.keys(SHEETS).forEach(function (k) { o[k] = rows(k); });
  o.Accounts = o.Accounts.map(publicAccount);   // never send password hashes to the browser
  o.Credentials = o.Credentials.map(publicCredential);
  var hr = can('hr');   // HR sees the employee file fields; everyone else only names for assigning work
  o.Staff = o.Staff.filter(function (x) { return x.status === ACC_ACTIVE; }).map(function (x) {
    return hr ? pick(x, ['username', 'name', 'jobTitle', 'role', 'phone', 'email', 'qid', 'hireDate', 'salary', 'allowance', 'contractType', 'contractStart', 'contractEnd', 'nationality', 'leaveDays', 'shiftStart', 'shiftEnd'].concat(Object.keys(HR_FIELDS)))
      : {username: x.username, name: x.name, jobTitle: x.jobTitle, role: x.role}; });
  if (!can('finance')) { o.Coa = []; o.Journal = []; o.Budget = []; }
  o.Lock = prop('LOCK_DATE');
  if (!hr) ['Leaves', 'Payroll', 'Evals'].forEach(function (k) { o[k] = o[k].filter(function (x) { return x.username === STAFF.username; }); });
  delete o.Sessions; delete o.Activity; delete o.SecurityLog; delete o.Ads;
  if (!can('admin')) o.Reviews = [];
  if (!can('finance')) { o.Payments = []; o.Expenses = []; }
  if (!can('assign')) o.Tasks = o.Tasks.filter(function (x) { return x.assignee === STAFF.username || x.by === STAFF.username; });
  // employees get only what their permissions allow
  if (!can('credentials')) o.Credentials = [];
  if (!can('messages')) o.Messages = [];
  if (!can('accounts')) o.Accounts = o.Accounts.map(function (a) { return {id: a.id, clientId: a.clientId, status: a.status}; });
  if (!can('requests')) o.Requests = o.Requests.filter(function (r) { return r.assignee === STAFF.username; });
  if (!can('clients_view')) { o.Clients = o.Clients.map(function (c) { return {id: c.id, name: c.name, type: c.type}; }); o.Consents = []; }
  if (!can('log')) o.Log = o.Log.filter(function (l) { return l.by === STAFF.username; });
  if (!can('finance')) o.Transactions = o.Transactions.map(stripFees);   // portal passwords only through 'reveal', which is logged
  return o;
}
function nextId(name) {
  var p = PREFIX[name], max = 0;
  rows(name).forEach(function (r) { var m = String(r.id).match(/(\d+)$/); if (m) max = Math.max(max, Number(m[1])); });
  return p + '-' + ('0000' + (max + 1)).slice(-4);
}
function now() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm'); }
function saveRow(name, row) {
  var sh = sheet(name), cols = SHEETS[name];
  row = row || {};
  if (!row.id) { row.id = nextId(name); row.created = now(); }
  if (cols.indexOf('updated') >= 0) row.updated = now();
  var values = cols.map(function (c) { var v = row[c]; v = v == null ? '' : (typeof v === 'object' ? JSON.stringify(v) : v); return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v; });   // text that looks like a formula stays text
  var ids = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]); }) : [];
  var i = ids.indexOf(String(row.id));
  // keep text columns as text so phone numbers and IDs keep leading digits
  if (i >= 0) sh.getRange(i + 2, 1, 1, cols.length).setNumberFormat('@').setValues([values]);
  else sh.getRange(sh.getLastRow() + 1, 1, 1, cols.length).setNumberFormat('@').setValues([values]);
  return row;
}
function deleteRow(name, id) {
  var sh = sheet(name), n = sh.getLastRow() - 1; if (n < 1) return false;
  var ids = sh.getRange(2, 1, n, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) { sh.deleteRow(i + 2); return true; }
  return false;
}
function log(clientId, txnId, kind, subject, body) {
  saveRow('Log', {clientId: clientId || '', txnId: txnId || '', kind: kind, subject: subject || '', body: body || '', by: 'system'});
}

// ---------- visitor sign-up from the website (name, mobile, optional email and company) ----------
function publicRegister(r) {
  if (r.hp) return {ok: true};
  var name = clean(r.name, 120), phone = clean(r.phone, 20).replace(/\s/g, ''), email = clean(r.email, 120), company = clean(r.company, 120);
  if (!name || !/^(\+?974)?[3567]\d{7}$/.test(phone) || !r.accept) return {ok: false, error: 'invalid'};
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) email = '';
  var cache = CacheService.getScriptCache(), key = 'rg_' + phone.slice(-8);
  if (Number(cache.get(key) || 0) >= 5 || !publicGate()) return {ok: false, error: 'rate_limited'};
  cache.put(key, String(Number(cache.get(key) || 0) + 1), 3600);
  var phone8 = phone.slice(-8);
  return withLock(function () {
    var c = rows('Clients').filter(function (x) { return String(x.phone).slice(-8) === phone8; })[0];
    var note = (company ? 'الشركة: ' + company + ' · ' : '') + 'المسؤول: ' + name;
    if (!c) {
      c = saveRow('Clients', {name: company || name, type: company ? 'منشأة' : 'فرد', phone: phone8, email: email, source: 'تسجيل الموقع', notes: note});
      log(c.id, '', 'register', 'تسجيل زائر من الموقع', note);
    } else if (email && email !== c.email) log(c.id, '', 'register', 'تسجيل زائر برقم عميل موجود', note + ' · بريد مذكور: ' + email + ' (لم يُغيَّر بريد الملف)');
    consent(c.id, name, phone8, LEGAL_DOCS, r.lang, 'التسجيل الأولي');
    return {ok: true, id: c.id};
  });
}

// ---------- client accounts («حسابي») ----------
function hex(bytes) { return bytes.map(function (b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join(''); }
function hashPw(salt, pw) {
  var h = salt + '|' + pw;
  for (var i = 0; i < PW_ROUNDS; i++) h = hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + salt, Utilities.Charset.UTF_8));
  return h;
}
function publicAccount(a) { return {id: a.id, created: a.created, clientId: a.clientId, username: a.username, status: a.status, lastLogin: a.lastLogin, updated: a.updated}; }
function pick(o, keys) { var r = {}; keys.forEach(function (k) { r[k] = o[k] == null ? '' : o[k]; }); return r; }
function validUser(u) { return /^[a-z0-9_.]{4,30}$/.test(u); }
function validPw(p) { return typeof p === 'string' && p.length >= 8 && p.length <= 100; }
function findAccount(f) { return rows('Accounts').filter(f)[0]; }
function clientToken(acc) {
  var exp = String(Date.now() + CLIENT_TOKEN_HOURS * 3600 * 1000), body = acc.id + '.' + exp;
  return 'c.' + body + '.' + sign('c|' + body + '|' + tv(acc));
}
function checkClientToken(t) {
  TOKEN_BAD = false;
  var p = String(t || '').split('.');
  if (p.length !== 4 || p[0] !== 'c') { TOKEN_BAD = !!t; return null; }
  if (!(Number(p[2]) > Date.now())) return null;
  var acc = findAccount(function (a) { return a.id === p[1]; });
  if (!acc || p[3] !== sign('c|' + p[1] + '.' + p[2] + '|' + tv(acc))) { TOKEN_BAD = true; return null; }
  return acc.status === ACC_ACTIVE ? acc : null;
}
function idKey(id) { return /^\+?\d{8,12}$/.test(id) ? 'p' + id.slice(-8) : 'u' + id; }
function bump(key, max) {   // simple per-key counter for an hour; returns false once over the limit
  var c = CacheService.getScriptCache(), n = Number(c.get(key) || 0);
  if (n >= max) return false;
  c.put(key, String(n + 1), 3600); return true;
}

function clientSignup(r) {
  if (r.hp) return {ok: false, error: 'invalid'};
  var name = clean(r.name, 120), phone = clean(r.phone, 20).replace(/\s/g, ''), email = clean(r.email, 120);
  var username = clean(r.username, 30).toLowerCase(), pw = String(r.password || '');
  if (!name || !/^(\+?974)?[3567]\d{7}$/.test(phone)) return {ok: false, error: 'invalid'};
  if (!validUser(username)) return {ok: false, error: 'bad_username'};
  if (!validPw(pw)) return {ok: false, error: 'weak_password'};
  if (!r.accept) return {ok: false, error: 'must_accept'};
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) email = '';
  if (!bump('su_' + phone.slice(-8), 5) || !publicGate()) return {ok: false, error: 'rate_limited'};
  var phone8 = phone.slice(-8), company = clean(r.company, 120);
  var res = withLock(function () {
    if (findAccount(function (a) { return a.username === username; })) return {ok: false, error: 'username_taken'};
    var c = rows('Clients').filter(function (x) { return String(x.phone).slice(-8) === phone8; })[0];
    if (c && findAccount(function (a) { return a.clientId === c.id; })) return {ok: false, error: 'phone_has_account'};
    // An existing client with transactions or files gets a pending account: the office confirms the number by phone
    // before the account can see that history (nobody can claim someone else's file by typing their number).
    // A file the office created itself (it may hold QID, CR and notes) also waits for the office's call.
    var history = c && (rows('Transactions').some(function (t) { return t.clientId === c.id; }) ||
      rows('Files').some(function (f) { return f.clientId === c.id; }) ||
      ['تسجيل الموقع', 'الموقع', 'حساب الموقع'].indexOf(String(c.source)) < 0);
    var data = {type: company ? 'منشأة' : 'فرد', cr: clean(r.cr, 40), estCard: clean(r.estCard, 40), taxNo: clean(r.taxNo, 40), qid: clean(r.qid, 20), address: clean(r.address, 200)};
    if (!c) {
      c = {name: company || name, phone: phone8, email: email, source: 'حساب الموقع', notes: (company ? 'الشركة: ' + company + ' · ' : '') + 'المسؤول: ' + name};
      Object.keys(data).forEach(function (k) { c[k] = data[k]; });
      c = saveRow('Clients', c);
    } else if (!history) {
      if (company) c.name = company;
      Object.keys(data).forEach(function (k) { if (data[k]) c[k] = data[k]; });
      if (email) c.email = email;
      c.notes = (c.notes ? c.notes + ' · ' : '') + 'المسؤول: ' + name;
      saveRow('Clients', c);
    }
    var salt = Utilities.getUuid();
    var acc = saveRow('Accounts', {clientId: c.id, username: username, salt: salt, hash: hashPw(salt, pw), status: history ? ACC_PENDING : ACC_ACTIVE, lastLogin: ''});
    consent(c.id, clean(r.signName, 120) || name, phone8, LEGAL_DOCS, r.lang, 'إنشاء الحساب' + (company ? ' عن ' + company : ''));
    log(c.id, '', 'account', 'إنشاء حساب على الموقع: ' + username + (history ? ' (بانتظار التفعيل)' : ''), company ? 'الشركة: ' + company : '');
    return {ok: true, acc: acc, client: c, pending: !!history};
  });
  if (!res.ok) return res;
  try {
    var to = prop('OFFICE_EMAIL');
    if (to) MailApp.sendEmail({to: to, name: 'موقع جاهز', subject: (res.pending ? 'حساب بانتظار التفعيل: ' : 'حساب جديد: ') + res.client.name,
      htmlBody: shell('<p>أنشأ عميل حساباً على الموقع.</p><p>الاسم: ' + escHtml(name) + '<br>الشركة: ' + escHtml(company || '—') + '<br>الجوال: ' + phone8 + '<br>اسم المستخدم: ' + escHtml(username) + '<br>رقم العميل: ' + res.client.id + '</p>' +
        (res.pending ? '<p><b>هذا الرقم مسجل لعميل لديه معاملات أو ملفات سابقة.</b> اتصل بالرقم للتأكد، ثم فعّل الحساب من نظام العملاء (ملف العميل ← الحساب).</p>' : ''))});
    if (mailOk(email)) MailApp.sendEmail({to: email, name: r.lang === 'en' ? 'Jahiz' : 'جاهز', replyTo: to || undefined,
      subject: r.lang === 'en' ? 'Your Jahiz account' : 'تم إنشاء حسابك في جاهز',
      htmlBody: shell(r.lang === 'en'
        ? '<p>Hello ' + escHtml(name) + ',</p><p>Your account has been created. Username: <b>' + escHtml(username) + '</b>.</p>' + (res.pending ? '<p>Because this mobile number already has a file with us, we will call you to confirm it and then activate your account.</p>' : '<p>Sign in from the “My account” page to request services and follow your work.</p>')
        : '<p>السلام عليكم ' + escHtml(name) + '،</p><p>تم إنشاء حسابك. اسم المستخدم: <b>' + escHtml(username) + '</b>.</p>' + (res.pending ? '<p>لأن رقم جوالك مسجل لدينا مسبقاً، سنتصل بك للتأكد منه ثم نفعّل حسابك.</p>' : '<p>ادخل من صفحة «حسابي» لطلب الخدمات ومتابعة طلباتك ومعاملاتك وتنزيل ملفاتك.</p>'), r.lang === 'en')});
  } catch (err) { log(res.client.id, '', 'error', 'signup mail failed', String(err)); }
  if (res.pending) { secLog('medium', 'حساب جديد يطلب ربطه بملف عميل موجود (بانتظار تفعيلك بعد الاتصال بالعميل)', username, 'الجوال ' + phone8 + ' · ' + res.client.id); return {ok: true, pending: true}; }
  return {ok: true, token: clientToken(res.acc)};
}

function clientLogin(r) {
  var id = clean(r.username, 30).toLowerCase().replace(/\s/g, ''), pw = String(r.password || '');
  if (!id || !pw) return {ok: false, error: 'wrong_login'};
  if (cget('cl_' + idKey(id)) >= CLIENT_LOCK_FAILS) return {ok: false, error: 'rate_limited'};
  Utilities.sleep(300);
  var acc = findAccount(function (a) { return a.username === id; });
  if (!acc && /^\+?\d{8,12}$/.test(id)) {   // allow signing in with the mobile number too
    var c = rows('Clients').filter(function (x) { return String(x.phone).slice(-8) === id.slice(-8); })[0];
    if (c) acc = findAccount(function (a) { return a.clientId === c.id; });
  }
  if (acc && cget('ca_' + acc.id) >= CLIENT_LOCK_FAILS) return {ok: false, error: 'rate_limited'};
  if (!acc || hashPw(acc.salt, pw) !== acc.hash) {
    cinc('cl_' + idKey(id), 3600);
    if (acc && cinc('ca_' + acc.id, 3600) === CLIENT_LOCK_FAILS) secLog('high', 'قُفل حساب عميل بعد محاولات دخول خاطئة متكررة', acc.username, acc.clientId);
    watch('gfail', 30, 'هجوم تخمين كلمات مرور على الخادم (محاولات فاشلة كثيرة)', 'كل الحسابات');
    return {ok: false, error: 'wrong_login'};
  }
  if (acc.status === ACC_PENDING) return {ok: false, error: 'pending'};
  if (acc.status !== ACC_ACTIVE) return {ok: false, error: 'disabled'};
  withLock(function () { acc.lastLogin = now(); saveRow('Accounts', acc); });
  return {ok: true, token: clientToken(acc)};
}

// ---------- forgotten password: a 6-digit code to the client's email, valid 15 minutes, 5 tries ----------
function accountById(id) {   // username, or the mobile number on the client file
  id = clean(id, 30).toLowerCase().replace(/\s/g, '');
  var acc = id && findAccount(function (a) { return a.username === id; });
  if (!acc && /^\+?\d{8,12}$/.test(id)) {
    var c = rows('Clients').filter(function (x) { return String(x.phone).slice(-8) === id.slice(-8); })[0];
    if (c) acc = findAccount(function (a) { return a.clientId === c.id; });
  }
  return acc || null;
}
function clientLang(clientId) {
  var k = rows('Consents').filter(function (x) { return x.clientId === clientId; }).pop();
  return k && k.lang === 'en' ? 'en' : 'ar';
}
function clientForgot(r) {
  var id = clean(r.username, 30).toLowerCase();
  if (!id) return {ok: false, error: 'invalid'};
  if (!bump('fg_' + idKey(id), 5)) return {ok: false, error: 'rate_limited'};
  Utilities.sleep(300);
  var acc = accountById(id), c = acc && rows('Clients').filter(function (x) { return x.id === acc.clientId; })[0];
  if (acc && !bump('fa_' + acc.id, 3)) { watch('fa_' + acc.id, 1, 'طلبات متكررة لرمز استعادة كلمة مرور عميل', acc.username); return {ok: true}; }
  // Same answer whether or not the account exists, so nobody can probe for usernames or numbers.
  if (!acc || acc.status !== ACC_ACTIVE || !c || !c.email) return {ok: true};
  var code = String(100000 + parseInt(Utilities.getUuid().replace(/\D/g, '').slice(0, 9) || '0', 10) % 900000);
  CacheService.getScriptCache().put('rs_' + acc.id, JSON.stringify({h: hashPw(acc.salt, 'reset:' + code), n: 0, exp: Date.now() + 15 * 60000}), 900);
  var en = (r.lang || clientLang(c.id)) === 'en';
  try {
    MailApp.sendEmail({to: c.email, name: en ? 'Jahiz' : 'جاهز', replyTo: prop('OFFICE_EMAIL') || undefined,
      subject: en ? 'Your password reset code: ' + code : 'رمز استعادة كلمة المرور: ' + code,
      htmlBody: shell(en
        ? '<p>Hello ' + escHtml(c.name) + ',</p><p>Your code to set a new password is:</p><p style="font-size:28px;letter-spacing:6px"><b>' + code + '</b></p><p>It works for 15 minutes. Username: <b>' + escHtml(acc.username) + '</b>.</p><p style="color:#5b6580">If you did not ask for this, ignore this email; your password has not changed.</p>'
        : '<p>السلام عليكم ' + escHtml(c.name) + '،</p><p>رمز تعيين كلمة مرور جديدة لحسابك:</p><p style="font-size:28px;letter-spacing:6px"><b>' + code + '</b></p><p>صالح لمدة 15 دقيقة. اسم المستخدم: <b>' + escHtml(acc.username) + '</b>.</p><p style="color:#5b6580">إذا لم تطلب ذلك فتجاهل هذه الرسالة، ولم تتغير كلمة مرورك.</p>', en)});
  } catch (err) { log(c.id, '', 'error', 'reset mail failed', String(err)); }
  log(c.id, '', 'account', 'طلب العميل رمز استعادة كلمة المرور', '');
  return {ok: true};
}
function clientReset(r) {
  var acc = accountById(r.username), code = String(r.code || '').replace(/\D/g, ''), pw = String(r.password || '');
  if (!validPw(pw)) return {ok: false, error: 'weak_password'};
  var cache = CacheService.getScriptCache(), key = acc ? 'rs_' + acc.id : '', st = null;
  try { st = acc && JSON.parse(cache.get(key) || 'null'); } catch (err) {}
  if (!st || !st.h || st.exp < Date.now() || st.n >= 5) return {ok: false, error: 'bad_code'};
  if (hashPw(acc.salt, 'reset:' + code) !== st.h) { st.n++; cache.put(key, JSON.stringify(st), 900); if (st.n === 5) secLog('high', 'تخمين رمز استعادة كلمة مرور عميل', acc.username, acc.clientId); return {ok: false, error: 'bad_code'}; }
  cache.put(key, 'null', 1);
  acc.salt = Utilities.getUuid(); acc.hash = hashPw(acc.salt, pw); acc.lastLogin = now(); saveRow('Accounts', acc);
  log(acc.clientId, '', 'account', 'العميل عيّن كلمة مرور جديدة برمز البريد', '');
  secLog('low', 'استعادة كلمة مرور عميل برمز البريد', acc.username, acc.clientId);
  return {ok: true, token: clientToken(acc)};
}

function clientMe(acc) {
  var c = rows('Clients').filter(function (x) { return x.id === acc.clientId; })[0];
  if (!c) return {ok: false, error: 'auth'};
  var mine = function (name, fields) { return rows(name).filter(function (x) { return x.clientId === c.id; }).map(function (x) { return pick(x, fields); }).reverse(); };
  var files = rows('Files').filter(function (f) { return f.clientId === c.id; }).map(function (f) {
    return {id: f.id, created: f.created, txnId: f.txnId, title: f.title, link: f.fileId ? '' : f.url};   // Drive files are fetched through cfile
  }).reverse();
  var creds = rows('Credentials').filter(function (x) { return x.clientId === c.id; }).map(function (x) { return {id: x.id, created: x.created, portal: x.portal, username: x.username}; });
  var msgs = rows('Messages').filter(function (m) { return m.clientId === c.id; });
  var unread = msgs.filter(function (m) { return m.from === 'office' && !m.read; });
  if (unread.length) withLock(function () { unread.forEach(function (m) { m.read = 'نعم'; saveRow('Messages', m); }); });
  var signed = rows('Consents').filter(function (x) { return x.clientId === c.id; }).pop();
  return {ok: true, username: acc.username, client: pick(c, CLIENT_FIELDS), requests: mine('Requests', REQ_FIELDS), transactions: mine('Transactions', TXN_FIELDS), files: files,
    reviews: mine('Reviews', ['id', 'txnId', 'stars', 'comment', 'publish', 'status']),
    payments: rows('Payments').filter(function (x) { return x.clientId === c.id; }).map(function (x) { return pick(x, PAY_FIELDS); }).reverse(),
    credentials: creds, messages: msgs.map(function (m) { return {id: m.id, created: m.created, from: m.from, body: m.body}; }), consent: signed ? {created: signed.created, version: signed.version, name: signed.name} : null, legalVersion: LEGAL_VERSION};
}

function clientProfile(acc, p) {
  var c = rows('Clients').filter(function (x) { return x.id === acc.clientId; })[0];
  if (!c) return {ok: false, error: 'auth'};
  var changed = [];
  CLIENT_EDITABLE.forEach(function (k) {
    if (p[k] == null) return;
    var v = clean(p[k], k === 'address' ? 200 : 120);
    if (k === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return;
    if (k === 'name' && !v) return;
    if (String(c[k]) !== v) { changed.push(k + ': ' + v); c[k] = v; }
  });
  if (changed.length) { saveRow('Clients', c); log(c.id, '', 'profile', 'العميل حدّث بياناته من حسابه', changed.join('\n')); }
  return {ok: true, client: pick(c, CLIENT_FIELDS)};
}

function clientRequest(acc, r) {
  var svc = clean(r.services, 3000), note = clean(r.notes, 1000);
  if (!svc) return {ok: false, error: 'invalid'};
  if (!bump('cr_' + acc.id, 10)) return {ok: false, error: 'rate_limited'};
  return withLock(function () {
    var c = rows('Clients').filter(function (x) { return x.id === acc.clientId; })[0];
    var rq = saveRow('Requests', {name: c.name, phone: c.phone, email: c.email, type: c.type, plan: clean(r.plan, 30), services: svc,
      codes: cleanCodes(r.codes), lang: r.lang === 'en' ? 'en' : 'ar', status: 'جديد', clientId: c.id, mailed: '',
      notes: 'من حساب العميل (' + acc.username + ')' + (note ? '\n' + note : '')});
    var mailed = false;
    if (c.email) { try { sendAutoReply(rq); mailed = true; } catch (err) {} }
    rq.mailed = mailed ? 'نعم' : 'لا'; saveRow('Requests', rq);
    try { notifyOffice(rq); } catch (err) {}
    log(c.id, '', 'request', 'طلب جديد من حساب العميل ' + rq.id, svc + (note ? '\n' + note : ''));
    return {ok: true, id: rq.id, mailed: mailed};
  });
}

function clientPassword(acc, old, pw) {
  if (hashPw(acc.salt, String(old || '')) !== acc.hash) return {ok: false, error: 'wrong_login'};
  if (!validPw(pw)) return {ok: false, error: 'weak_password'};
  acc.salt = Utilities.getUuid(); acc.hash = hashPw(acc.salt, pw); saveRow('Accounts', acc);
  log(acc.clientId, '', 'account', 'العميل غيّر كلمة المرور', '');
  return {ok: true, token: clientToken(acc)};   // older sessions end with the old password
}

function clientFile(acc, id) {
  var f = rows('Files').filter(function (x) { return x.id === id && x.clientId === acc.clientId; })[0];
  if (!f) return {ok: false, error: 'not_found'};
  if (!f.fileId) return {ok: true, link: f.url};
  var blob = DriveApp.getFileById(f.fileId).getBlob();
  return {ok: true, name: blob.getName(), mime: blob.getContentType(), data: Utilities.base64Encode(blob.getBytes())};
}

// ---------- staff side: accounts and files ----------
function staffAccount(r) {
  var c = rows('Clients').filter(function (x) { return x.id === r.clientId; })[0];
  if (!c) return {ok: false, error: 'not_found'};
  var acc = findAccount(function (a) { return a.clientId === c.id; }) || {clientId: c.id, status: ACC_ACTIVE, lastLogin: ''};
  if (r.username != null) {
    var u = clean(r.username, 30).toLowerCase();
    if (!validUser(u)) return {ok: false, error: 'bad_username'};
    if (findAccount(function (a) { return a.username === u && a.id !== acc.id; })) return {ok: false, error: 'username_taken'};
    acc.username = u;
  }
  if (!acc.username) return {ok: false, error: 'bad_username'};
  if (r.password) {
    if (!validPw(r.password)) return {ok: false, error: 'weak_password'};
    acc.salt = Utilities.getUuid(); acc.hash = hashPw(acc.salt, r.password);
  }
  if (!acc.hash) return {ok: false, error: 'weak_password'};
  if ([ACC_ACTIVE, ACC_PENDING, ACC_OFF].indexOf(r.status) >= 0) acc.status = r.status;
  acc = saveRow('Accounts', acc);
  saveRow('Log', {clientId: c.id, kind: 'account', subject: 'تحديث حساب العميل: ' + acc.username + ' · ' + acc.status + (r.password ? ' · كلمة مرور جديدة' : ''), body: '', by: STAFF.username});
  return {ok: true, row: publicAccount(acc)};
}

function clientFolder(clientId) {
  var p = PropertiesService.getScriptProperties(), rootId = p.getProperty('FILES_FOLDER'), root;
  try { root = rootId && DriveApp.getFolderById(rootId); } catch (err) { root = null; }
  if (!root) { root = DriveApp.createFolder('جاهز - ملفات العملاء'); p.setProperty('FILES_FOLDER', root.getId()); }
  var it = root.getFoldersByName(clientId);
  return it.hasNext() ? it.next() : root.createFolder(clientId);
}
function staffUpload(r) {
  var c = rows('Clients').filter(function (x) { return x.id === r.clientId; })[0];
  if (!c) return {ok: false, error: 'not_found'};
  var data = String(r.data || '');
  if (!data || data.length > MAX_UPLOAD_MB * 1024 * 1024 * 4 / 3) return {ok: false, error: 'too_large'};
  var name = clean(r.name, 150) || 'file';
  var blob = Utilities.newBlob(Utilities.base64Decode(data), clean(r.mime, 100) || 'application/octet-stream', name);
  var file = clientFolder(c.id).createFile(blob);   // stays private to the office's Google account
  var row = saveRow('Files', {clientId: c.id, txnId: clean(r.txnId, 20), title: clean(r.title, 150) || name, url: file.getUrl(), fileId: file.getId(), by: STAFF.username});
  saveRow('Log', {clientId: c.id, txnId: row.txnId, kind: 'file', subject: 'رفع ملف للعميل: ' + row.title, body: '', by: STAFF.username});
  var mailed = false;   // clients with an account hear about new documents by email
  if (r.notify !== false && c.email && findAccount(function (a) { return a.clientId === c.id && a.status === ACC_ACTIVE; })) {
    var en = clientLang(c.id) === 'en';
    try { MailApp.sendEmail({to: c.email, name: en ? 'Jahiz' : 'جاهز', replyTo: prop('OFFICE_EMAIL') || undefined,
      subject: en ? 'A new document in your account: ' + row.title : 'مستند جديد في حسابك: ' + row.title,
      htmlBody: shell(en ? '<p>Hello ' + escHtml(c.name) + ',</p><p>We added <b>' + escHtml(row.title) + '</b> to your account. Download it from the “My account” page, under Files.</p>'
        : '<p>السلام عليكم ' + escHtml(c.name) + '،</p><p>أضفنا إلى حسابك: <b>' + escHtml(row.title) + '</b>. يمكنك تنزيله من صفحة «حسابي» على الموقع ← الملفات.</p>', en)}); mailed = true; } catch (err) {}
  }
  return {ok: true, row: row, mailed: mailed};
}
// ---------- consents and government-portal logins ----------
function consent(clientId, name, phone, docs, lang, source) {
  saveRow('Consents', {clientId: clientId, name: name, phone: phone, docs: docs, version: LEGAL_VERSION, lang: lang === 'en' ? 'en' : 'ar', source: source});
}
// Apps Script has no built-in AES, so portal passwords are encrypted with an HMAC-SHA256 keystream
// (random nonce per value) and authenticated with a separate HMAC. The key lives only in Script Properties,
// so the sheet alone (or a copy of it) does not reveal any password.
function credKey() {
  var p = PropertiesService.getScriptProperties(), k = p.getProperty('CRED_KEY');
  if (!k) { k = Utilities.getUuid() + Utilities.getUuid(); p.setProperty('CRED_KEY', k); }
  return k;
}
function bytesOf(s) { return Utilities.newBlob(String(s)).getBytes(); }
function keystream(nonce, n) {
  var out = [], k = credKey();
  for (var i = 0; out.length < n; i++) out = out.concat(Utilities.computeHmacSha256Signature(nonce + '|' + i, k));
  return out.slice(0, n);
}
function encrypt(plain) {
  var nonce = Utilities.getUuid(), b = bytesOf(plain), ks = keystream(nonce, b.length);
  var ct = Utilities.base64Encode(b.map(function (x, i) { return ((x ^ ks[i]) << 24) >> 24; }));
  return nonce + ':' + ct + ':' + Utilities.base64Encode(Utilities.computeHmacSha256Signature('m|' + nonce + ':' + ct, credKey()));
}
function decrypt(enc) {
  var p = String(enc).split(':');
  if (p.length !== 3 || Utilities.base64Encode(Utilities.computeHmacSha256Signature('m|' + p[0] + ':' + p[1], credKey())) !== p[2]) throw new Error('bad_cipher');
  var b = Utilities.base64Decode(p[1]), ks = keystream(p[0], b.length);
  return Utilities.newBlob(b.map(function (x, i) { return ((x ^ ks[i]) << 24) >> 24; })).getDataAsString('UTF-8');
}
function publicCredential(x) { return {id: x.id, created: x.created, clientId: x.clientId, portal: x.portal, username: x.username, note: x.note, by: x.by, updated: x.updated}; }
function clientCredential(acc, r) {
  var portal = clean(r.portal, 80), user = clean(r.username, 120), pw = String(r.password || '').slice(0, 200), note = clean(r.note, 300);
  if (!portal || !user || !pw) return {ok: false, error: 'invalid'};
  if (!r.consent) return {ok: false, error: 'must_accept'};
  if (rows('Credentials').filter(function (x) { return x.clientId === acc.clientId; }).length >= 20) return {ok: false, error: 'too_many'};
  var c = rows('Clients').filter(function (x) { return x.id === acc.clientId; })[0];
  var row = saveRow('Credentials', {clientId: acc.clientId, portal: portal, username: user, secret: encrypt(pw), note: note, by: 'العميل (' + acc.username + ')'});
  consent(acc.clientId, clean(r.signName, 120) || c.name, c.phone, 'بيانات الدخول إلى البوابات الحكومية: ' + portal, r.lang, 'حسابي');
  log(acc.clientId, '', 'credential', 'العميل أضاف بيانات دخول بوابة: ' + portal, 'اسم المستخدم: ' + user);
  try { var to = prop('OFFICE_EMAIL'); if (to) MailApp.sendEmail({to: to, name: 'موقع جاهز', subject: 'بيانات دخول بوابة من العميل ' + c.name, htmlBody: shell('<p>أضاف العميل ' + escHtml(c.name) + ' (' + c.id + ') بيانات الدخول إلى: <b>' + escHtml(portal) + '</b>.</p><p>كلمة المرور محفوظة مشفرة، وتظهر من نظام العملاء ← ملف العميل ← بيانات البوابات.</p>')}); } catch (err) {}
  return {ok: true, row: {id: row.id, created: row.created, portal: portal, username: user}};
}
function clientCredentialDelete(acc, id) {
  var x = rows('Credentials').filter(function (y) { return y.id === id && y.clientId === acc.clientId; })[0];
  if (!x) return {ok: false, error: 'not_found'};
  deleteRow('Credentials', id);
  log(acc.clientId, '', 'credential', 'العميل حذف بيانات دخول بوابة: ' + x.portal, '');
  return {ok: true};
}
function staffReveal(id) {
  var x = rows('Credentials').filter(function (y) { return y.id === id; })[0];
  if (!x) return {ok: false, error: 'not_found'};
  audit('reveal', 'Credentials', x.id, x.clientId, 'إظهار كلمة مرور بوابة: ' + x.portal);
  secLog('low', 'إظهار كلمة مرور بوابة عميل', STAFF.username, x.clientId + ' · ' + x.portal);
  saveRow('Log', {clientId: x.clientId, kind: 'credential', subject: 'اطلاع على كلمة مرور بوابة: ' + x.portal, body: '', by: STAFF.username});
  return {ok: true, password: decrypt(x.secret)};
}

// ---------- messages between the client and the office ----------
function clientMessage(acc, body) {
  body = clean(body, 3000); if (!body) return {ok: false, error: 'invalid'};
  if (!bump('cm_' + acc.id, 30)) return {ok: false, error: 'rate_limited'};
  var c = rows('Clients').filter(function (x) { return x.id === acc.clientId; })[0];
  var m = saveRow('Messages', {clientId: c.id, from: 'client', by: acc.username, body: body, read: ''});
  try { var to = prop('OFFICE_EMAIL'); if (to) MailApp.sendEmail({to: to, name: 'موقع جاهز', subject: 'رسالة من العميل ' + c.name + ' (' + c.id + ')', htmlBody: shell('<p><b>' + escHtml(c.name) + '</b> كتب من حسابه:</p><p>' + escHtml(body).replace(/\n/g, '<br>') + '</p><p>رد عليه من نظام العملاء ← ملف العميل ← المراسلات.</p>')}); } catch (err) {}
  return {ok: true, row: {id: m.id, created: m.created, from: 'client', body: body}};
}
function staffReply(r) {
  var c = rows('Clients').filter(function (x) { return x.id === r.clientId; })[0];
  var body = String(r.body || '').replace(/[<>]/g, '').trim().slice(0, 5000);
  if (!c || !body) return {ok: false, error: 'invalid'};
  rows('Messages').filter(function (m) { return m.clientId === c.id && m.from === 'client' && !m.read; }).forEach(function (m) { m.read = 'نعم'; saveRow('Messages', m); });
  var m = saveRow('Messages', {clientId: c.id, from: 'office', by: STAFF.username, body: body, read: ''});
  var mailed = false;
  if (r.email !== false && c.email) {
    try { MailApp.sendEmail({to: c.email, name: 'جاهز', replyTo: prop('OFFICE_EMAIL') || undefined, subject: 'رسالة جديدة في حسابك | جاهز',
      htmlBody: shell('<p>السلام عليكم ' + escHtml(c.name) + '،</p><p>' + escHtml(body).replace(/\n/g, '<br>') + '</p><p style="color:#5b6580">يمكنك الرد من صفحة «حسابي» على الموقع ← المراسلات.</p>')}); mailed = true; } catch (err) {}
  }
  audit('reply', 'Messages', m.id, c.id, 'رد على العميل: ' + body.slice(0, 120));
  saveRow('Log', {clientId: c.id, kind: 'message', subject: 'رد على العميل من المراسلات' + (mailed ? ' (أُرسل بالبريد أيضاً)' : ''), body: body, by: STAFF.username});
  return {ok: true, row: m, mailed: mailed};
}

function trashDriveFile(id) {
  var f = rows('Files').filter(function (x) { return x.id === id; })[0];
  if (f && f.fileId) { try { DriveApp.getFileById(f.fileId).setTrashed(true); } catch (err) {} }
}

// ---------- public request from the website ----------
function publicRequest(r) {
  if (r.hp) return {ok: true, id: 'R-0000', mailed: false};           // honeypot: silently drop bots
  var name = clean(r.name, 120), phone = clean(r.phone, 20).replace(/\s/g, ''), email = clean(r.email, 120), svc = clean(r.services, 3000);
  if (!name || !/^(\+?974)?[3567]\d{7}$/.test(phone) || !svc) return {ok: false, error: 'invalid'};
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) email = '';
  var cache = CacheService.getScriptCache(), key = 'rl_' + phone.slice(-8);
  if (Number(cache.get(key) || 0) >= 5 || !publicGate()) return {ok: false, error: 'rate_limited'};
  cache.put(key, String(Number(cache.get(key) || 0) + 1), 3600);
  var phone8 = phone.slice(-8);
  return withLock(function () {
    var client = rows('Clients').filter(function (c) { return String(c.phone).slice(-8) === phone8; })[0];
    if (!client) client = saveRow('Clients', {name: name, type: clean(r.type, 20), phone: phone8, email: email, plan: clean(r.plan, 30), source: 'الموقع', requirements: svc});
    // the email typed on a public form never replaces or fills the email of an existing client file
    // (it would let anyone who knows a mobile number receive that client's password reset)
    var rq = saveRow('Requests', {name: name, phone: phone8, email: email, type: clean(r.type, 20), plan: clean(r.plan, 30), services: svc,
      codes: cleanCodes(r.codes), lang: r.lang === 'en' ? 'en' : 'ar', status: 'جديد', clientId: client.id, mailed: '', notes: r.contact ? 'وسيلة التواصل المفضلة: ' + clean(r.contact, 30) : ''});
    var mailed = false;
    if (mailOk(email)) { try { sendAutoReply(rq); mailed = true; } catch (err) { log(client.id, '', 'error', 'auto-reply failed', String(err)); } }
    rq.mailed = mailed ? 'نعم' : 'لا'; saveRow('Requests', rq);
    try { notifyOffice(rq); } catch (err) {}
    log(client.id, '', 'request', 'طلب جديد من الموقع ' + rq.id, svc);
    return {ok: true, id: rq.id, mailed: mailed};
  });
}
// all public forms together are capped per hour so a flood cannot fill the sheet or use up the mail quota
function publicGate() { var n = cinc('g_pub', 3600); if (n === PUBLIC_PER_HOUR) secLog('high', 'إغراق نماذج الموقع بطلبات آلية', 'الموقع', n + ' خلال ساعة'); return n < PUBLIC_PER_HOUR; }
// one address gets at most 3 automatic emails a day from the public forms (stops using the site to spam strangers)
function mailOk(email) { return !!email && cinc('em_' + String(email).toLowerCase(), 86400) <= 3; }
function cleanCodes(c) { return (Array.isArray(c) ? c : []).slice(0, 60).map(function (x) { return String(x).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 12); }).filter(String).join(' '); }
function clean(s, n) { return String(s == null ? '' : s).replace(/[<>]/g, '').trim().slice(0, n); }
function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function shell(html, en) {
  return '<div dir="' + (en ? 'ltr' : 'rtl') + '" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8;color:#14213a;max-width:600px">' +
    '<div style="background:#6d28d9;color:#fff;padding:14px 18px;border-radius:10px 10px 0 0;font-size:18px"><b>' + (en ? 'Jahiz' : 'جاهز') + '</b></div>' +
    '<div style="border:1px solid #dde2ec;border-top:0;padding:18px;border-radius:0 0 10px 10px">' + html +
    '<p style="color:#5b6580;font-size:13px;margin-top:22px">' + (en ? 'Jahiz · Doha, Qatar · WhatsApp +974 5160 0498 · munijizqa@gmail.com' : 'جاهز · الدوحة، قطر · واتساب ‎+974 5160 0498 · munijizqa@gmail.com') + '</p></div></div>';
}
function sendAutoReply(rq) {
  var en = rq.lang === 'en';
  var subject = en ? 'We received your order ' + rq.id + ' | Jahiz' : 'استلمنا طلبك رقم ' + rq.id + ' | جاهز';
  var body = en
    ? '<p>Hello ' + escHtml(rq.name) + ',</p><p>Thank you. Your order <b>' + rq.id + '</b> has reached Jahiz. We will contact you shortly to confirm the final price and delivery time, then forward it to the accredited partner who will fulfil and deliver it.</p><p><b>Your order:</b><br>' + escHtml(rq.services).replace(/\n/g, '<br>') + '</p><p>Nothing to pay now: you pay on delivery after we confirm the price with you.</p>'
    : '<p>السلام عليكم ' + escHtml(rq.name) + '،</p><p>شكراً لطلبك من جاهز. وصلنا طلبك برقم <b>' + rq.id + '</b>، وسنتواصل معك قريباً لتأكيد السعر النهائي وموعد التوصيل، ثم نحوّله إلى الشريك المعتمد الذي سينفّذه ويوصله لك.</p><p><b>طلبك:</b><br>' + escHtml(rq.services).replace(/\n/g, '<br>') + '</p><p>لا تدفع الآن: الدفع عند الاستلام بعد تأكيد السعر معك.</p>';
  MailApp.sendEmail({to: rq.email, subject: subject, htmlBody: shell(body, en), name: en ? 'Jahiz' : 'جاهز', replyTo: prop('OFFICE_EMAIL') || undefined});
}
function notifyOffice(rq) {
  var to = prop('OFFICE_EMAIL'); if (!to) return;
  MailApp.sendEmail({to: to, subject: 'طلب جديد ' + rq.id + ' من ' + rq.name, name: 'موقع جاهز',
    htmlBody: shell('<p><b>طلب جديد من الموقع</b></p><p>الاسم: ' + escHtml(rq.name) + '<br>الجوال: ' + rq.phone + '<br>البريد: ' + escHtml(rq.email || 'غير مذكور') + '<br>النوع: ' + escHtml(rq.type) + '<br>الباقة: ' + escHtml(rq.plan || 'بدون') + (rq.notes ? '<br>' + escHtml(rq.notes) : '') + '<br>رقم العميل: ' + rq.clientId + '</p><p>' + escHtml(rq.services).replace(/\n/g, '<br>') + '</p><p>افتح نظام العملاء لمتابعته.</p>')});
}

// ---------- email from the CRM ----------
function sendClientEmail(r) {
  var to = clean(r.to, 200), subject = clean(r.subject, 200), body = String(r.body || '').slice(0, 10000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || !subject || !body) return {ok: false, error: 'invalid'};
  MailApp.sendEmail({to: to, subject: subject, htmlBody: shell(escHtml(body).replace(/\n/g, '<br>'), r.lang === 'en'), name: r.lang === 'en' ? 'Jahiz' : 'جاهز', replyTo: prop('OFFICE_EMAIL') || undefined});
  saveRow('Log', {clientId: r.clientId || '', txnId: r.txnId || '', kind: 'email', subject: subject, body: body, by: STAFF ? STAFF.username : 'CRM'});
  return {ok: true, quota: MailApp.getRemainingDailyQuota()};
}

// ---------- daily reminder to the office ----------
function dailyReminders() {
  var to = prop('OFFICE_EMAIL'); if (!to) return;
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var days = function (d) { if (!d) return null; var x = new Date(d); return isNaN(x) ? null : Math.round((x - today) / 86400000); };
  var clients = {}; rows('Clients').forEach(function (c) { clients[c.id] = c; });
  var open = rows('Transactions').filter(function (t) { return ['منجزة', 'ملغاة'].indexOf(t.status) < 0; });
  var late = open.filter(function (t) { var d = days(t.dueDate); return d !== null && d < 0; });
  var renew = rows('Transactions').filter(function (t) { var d = days(t.expiryDate); return d !== null && d >= 0 && d <= 30; });
  var plans = rows('Clients').filter(function (c) { var d = days(c.planEnd); return d !== null && d >= 0 && d <= 30; });
  var newReq = rows('Requests').filter(function (r) { return r.status === 'جديد'; });
  var y = new Date(today.getTime() - 86400000), yd = Utilities.formatDate(y, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var staffRep = staffReport(yd, yd), worked = staffRep.staff.filter(function (s) { return s.days.length || s.actions; });
  var sec = securitySummaryHtml();
  var hrDocs = [];   // employee documents that expired or end within 30 days
  rows('Staff').filter(function (s) { return s.status === ACC_ACTIVE; }).forEach(function (s) { Object.keys(HR_DOCS).forEach(function (k) { var d = days(s[k]); if (d !== null && d <= 30) hrDocs.push({s: s, doc: HR_DOCS[k], date: s[k], d: d}); }); });
  if (!late.length && !renew.length && !plans.length && !newReq.length && !worked.length && !sec && !hrDocs.length) return;
  var li = function (arr, f) { return arr.length ? '<ul>' + arr.map(function (x) { return '<li>' + f(x) + '</li>'; }).join('') + '</ul>' : '<p>لا يوجد.</p>'; };
  var cn = function (id) { return escHtml((clients[id] || {}).name || id); };
  MailApp.sendEmail({to: to, subject: 'متابعة اليوم: ' + newReq.length + ' طلب جديد، ' + late.length + ' متأخرة، ' + renew.length + ' تجديد قريب', name: 'نظام جاهز',
    htmlBody: shell('<h3>طلبات جديدة لم تُعالج</h3>' + li(newReq, function (r) { return r.id + ' · ' + escHtml(r.name) + ' · ' + r.phone; }) +
      '<h3>معاملات تجاوزت الموعد المتوقع</h3>' + li(late, function (t) { return t.id + ' · ' + cn(t.clientId) + ' · ' + escHtml(t.service) + ' · ' + t.dueDate; }) +
      '<h3>مستندات تنتهي خلال 30 يوماً</h3>' + li(renew, function (t) { return t.id + ' · ' + cn(t.clientId) + ' · ' + escHtml(t.service) + ' · ينتهي ' + t.expiryDate; }) +
      '<h3>اشتراكات باقات تنتهي خلال 30 يوماً</h3>' + li(plans, function (c) { return c.id + ' · ' + escHtml(c.name) + ' · ' + escHtml(c.plan) + ' · ' + c.planEnd; }) +
      (hrDocs.length ? '<h3>وثائق الموظفين: منتهية أو تنتهي خلال 30 يوماً</h3>' + li(hrDocs, function (x) { return escHtml(x.s.name || x.s.username) + ' · ' + x.doc + ' · ' + escHtml(x.date) + (x.d < 0 ? ' (منتهية)' : ' (بعد ' + x.d + ' يوم)'); }) : '') +
      '<h3>عمل الموظفين أمس</h3>' + (worked.length ? reportHtml(staffRep) : '<p>لم يسجّل أي موظف دخولاً أمس.</p>') + sec)});
}

// ---------- public tracking, client reviews ----------
// anyone with a transaction or request number and the last 4 digits of the phone on it sees its stage only: no names, no fees, no notes
var TRACK_STEP = {'جديدة': 1, 'بانتظار المستندات': 2, 'بانتظار العميل': 2, 'قيد التقديم': 3, 'قيد المتابعة لدى الجهة': 4, 'منجزة': 5, 'ملغاة': 0};
function last4(p) { var d = String(p || '').replace(/\D/g, ''); return d.length >= 4 ? d.slice(-4) : ''; }
function publicTrack(r) {
  var ref = String(r.ref || '').trim().toUpperCase().replace(/\s/g, ''), d4 = String(r.phone || '').replace(/\D/g, '');
  if (!/^[TR]-?\d{1,6}$/.test(ref) || d4.length !== 4) return {ok: false, error: 'invalid'};
  ref = ref.charAt(0) + '-' + ('0000' + ref.replace(/^[TR]-?/, '')).slice(-4);
  var key = 'trk_' + ref;   // 8 wrong tries on one number lock it for an hour; right answers are not counted
  var g = cinc('g_trk', 3600);   // its own hourly budget, so tracking never uses up the public forms' budget
  if (g === 300) secLog('high', 'محاولات تتبع كثيرة (تخمين أرقام المعاملات)', 'الموقع', g + ' خلال ساعة');
  if (g > 300 || Number(CacheService.getScriptCache().get(key) || 0) >= 8) return {ok: false, error: 'rate_limited'};
  var miss = {ok: false, error: 'not_found'}, fail = function () { if (cinc(key, 3600) === 8) secLog('medium', 'قُفل رقم معاملة في التتبع بعد محاولات خاطئة', 'الموقع', ref); return miss; };
  if (ref.charAt(0) === 'T') {
    var t = rows('Transactions').filter(function (x) { return x.id === ref; })[0];
    if (!t) return fail();
    var c = rows('Clients').filter(function (x) { return x.id === t.clientId; })[0];
    if (!c || last4(c.phone) !== d4) return fail();
    return {ok: true, kind: 'txn', ref: ref, code: String(t.code || ''), step: TRACK_STEP.hasOwnProperty(t.status) ? TRACK_STEP[t.status] : 1,
      waiting: t.status === 'بانتظار العميل', cancelled: t.status === 'ملغاة', progress: progressOf(t), due: String(t.dueDate || '').slice(0, 10), updated: String(t.updated || t.created || '').slice(0, 10)};
  }
  var q = rows('Requests').filter(function (x) { return x.id === ref; })[0];
  if (!q || last4(q.phone) !== d4) return fail();
  return {ok: true, kind: 'req', ref: ref, codes: String(q.codes || '').split(/[,\s]+/).filter(String).slice(0, 10),
    step: {'جديد': 1, 'تم التواصل': 2, 'تحوّل إلى معاملة': 3, 'مغلق': 3}[q.status] || 1, closed: q.status === 'مغلق', updated: String(q.updated || q.created || '').slice(0, 10)};
}
function clientReview(acc, r) {
  var t = rows('Transactions').filter(function (x) { return x.id === r.txnId && x.clientId === acc.clientId; })[0];
  if (!t || t.status !== 'منجزة') return {ok: false, error: 'invalid'};
  var stars = Math.round(Number(r.stars));
  if (!(stars >= 1 && stars <= 5)) return {ok: false, error: 'invalid'};
  if (rows('Reviews').some(function (x) { return x.txnId === t.id; })) return {ok: false, error: 'exists'};
  var c = rows('Clients').filter(function (x) { return x.id === acc.clientId; })[0] || {};
  var name = c.type === 'منشأة' ? clean(c.name, 60) : clean(String(c.name || '').split(/\s+/)[0], 30);
  CacheService.getScriptCache().remove('rev_pub');
  var row = saveRow('Reviews', {clientId: acc.clientId, txnId: t.id, stars: stars, comment: clean(r.comment, 600), publish: r.publish ? 'نعم' : 'لا', name: name, status: 'جديد', by: '', updated: ''});
  var to = prop('OFFICE_EMAIL');
  if (to) try { MailApp.sendEmail({to: to, name: 'نظام جاهز', subject: 'تقييم جديد من عميل: ' + stars + ' من 5', htmlBody: shell('<p>المعاملة ' + t.id + ' · ' + stars + ' من 5</p>' + (row.comment ? '<p>' + escHtml(row.comment) + '</p>' : '') + '<p>موافقة العميل على النشر: ' + row.publish + '. للنشر في الموقع: لوحة الإدارة ← آراء العملاء.</p>')}); } catch (e) {}
  return {ok: true, review: pick(row, ['id', 'txnId', 'stars', 'comment', 'publish', 'status'])};
}
function reviewSet(id, status) {
  if (['منشور', 'مخفي', 'جديد'].indexOf(status) < 0) return {ok: false, error: 'invalid'};
  var r = rows('Reviews').filter(function (x) { return x.id === id; })[0];
  if (!r) return {ok: false, error: 'not_found'};
  if (status === 'منشور' && r.publish !== 'نعم') return {ok: false, error: 'no_consent'};
  r.status = status; r.by = STAFF.username; r.updated = now();
  saveRow('Reviews', r); CacheService.getScriptCache().remove('rev_pub'); audit('review', 'Reviews', r.id, r.clientId, 'تقييم: ' + status);
  return {ok: true, row: r};
}
function publicReviews() {
  var cache = CacheService.getScriptCache(), hit = cache.get('rev_pub');
  if (hit) try { return JSON.parse(hit); } catch (e) {}
  var list = rows('Reviews').filter(function (x) { return x.status === 'منشور' && x.publish === 'نعم'; }).reverse().slice(0, 12);
  var out = {ok: true, reviews: list.map(function (x) { return {stars: Number(x.stars) || 0, comment: String(x.comment || ''), name: String(x.name || ''), date: String(x.created || '').slice(0, 7)}; })};
  cache.put('rev_pub', JSON.stringify(out), 300);
  return out;
}

// ---------- instant alerts to the owner's phone (CallMeBot, free) ----------
// Telegram works now; WhatsApp starts when ALERT_WHATSAPP and CALLMEBOT_KEY are set (CallMeBot was not giving WhatsApp keys in Oct 2026).
// Script Properties with the same names override these values.
var ALERT_TELEGRAM = '@mabouelezz2022', ALERT_WHATSAPP = '', CALLMEBOT_KEY = '';
function sendInstant(text) {
  text = String(text || '').slice(0, 700);
  var tg = prop('ALERT_TELEGRAM') || ALERT_TELEGRAM, wa = prop('ALERT_WHATSAPP') || ALERT_WHATSAPP, key = prop('CALLMEBOT_KEY') || CALLMEBOT_KEY;
  if (/^@?[A-Za-z0-9_]{3,40}$/.test(tg)) {
    try { UrlFetchApp.fetch('https://api.callmebot.com/text.php?user=' + (tg.charAt(0) === '@' ? tg : '@' + tg) + '&text=' + encodeURIComponent(text), {muteHttpExceptions: true}); } catch (err) {}
  }
  if (/^\d{8,15}$/.test(wa) && key) {
    try { UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone=' + wa + '&text=' + encodeURIComponent(text) + '&apikey=' + encodeURIComponent(key), {muteHttpExceptions: true}); } catch (err) {}
  }
}
// run once from the editor: it asks for the new permission (connecting to an external service) and sends a test alert
function testAlert() {
  sendInstant('✅ ' + COMPANY + ': اختبار تنبيهات الحماية. إذا وصلتك هذه الرسالة فالتنبيهات العاجلة تعمل. ' + now());
  var to = alertEmails();
  if (to.length) MailApp.sendEmail({to: to.join(','), name: 'حماية ' + COMPANY, subject: '✅ اختبار تنبيهات الحماية (' + COMPANY + ')', htmlBody: shell('<p>هذه رسالة تجريبية. التنبيهات العاجلة تعمل بالبريد وTelegram.</p>')});
  Logger.log('تم إرسال تنبيه تجريبي');
}

// ---------- website ads (managed by the admin; shown on the home page with the label «إعلان») ----------
// public read: only active ads inside their dates, only display fields, cached 5 minutes so page views never touch the sheet
function publicAds() {
  var c = CacheService.getScriptCache(), hit = c.get('ads_pub');
  if (hit) return JSON.parse(hit);
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var list = rows('Ads').filter(function (a) { return a.active === 'نعم' && (!a.start || String(a.start) <= today) && (!a.end || String(a.end) >= today); })
    .sort(function (a, b) { return (Number(a.sort) || 0) - (Number(b.sort) || 0); }).slice(0, 6)
    .map(function (a) { return {id: a.id, title: a.title, titleEn: a.titleEn, text: a.text, textEn: a.textEn, image: httpsUrl(a.image), link: httpsUrl(a.link)}; });
  var out = {ok: true, ads: list};
  c.put('ads_pub', JSON.stringify(out), 300);
  return out;
}
function httpsUrl(u) { u = String(u || '').trim(); return /^https:\/\/[^\s"'<>]+$/.test(u) && u.length <= 500 ? u : ''; }
function adDate(d) { d = String(d || '').trim(); return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : ''; }
function adSave(r) {
  var a = r.row || {}, old = a.id ? rows('Ads').filter(function (x) { return x.id === a.id; })[0] : null;
  if (a.id && !old) return {ok: false, error: 'not_found'};
  var row = {id: old ? old.id : '', created: old ? old.created : '', title: clean(a.title, 80), titleEn: clean(a.titleEn, 80), text: clean(a.text, 240), textEn: clean(a.textEn, 240),
    image: old ? old.image : '', imageId: old ? old.imageId : '', link: httpsUrl(a.link), start: adDate(a.start), end: adDate(a.end),
    active: a.active === 'نعم' ? 'نعم' : 'لا', sort: Math.max(0, Math.min(99, Number(a.sort) || 0)), by: STAFF.username};
  if (!row.title && !row.titleEn) return {ok: false, error: 'invalid'};
  if (a.link && !row.link) return {ok: false, error: 'bad_link'};
  if (r.image) { var img = adImage(r.image); if (!img.ok) return img; if (row.imageId) adTrash(row.imageId); row.image = img.url; row.imageId = img.id; }
  else if (a.removeImage) { if (row.imageId) adTrash(row.imageId); row.image = ''; row.imageId = ''; }
  row = saveRow('Ads', row);
  CacheService.getScriptCache().remove('ads_pub');
  audit(old ? 'ad_edit' : 'ad_add', 'Ads', row.id, '', (old ? 'تعديل إعلان: ' : 'إضافة إعلان: ') + (row.title || row.titleEn) + ' · ' + row.active);
  return {ok: true, row: row};
}
function adDelete(id) {
  var a = rows('Ads').filter(function (x) { return x.id === id; })[0];
  if (!a) return {ok: false, error: 'not_found'};
  if (a.imageId) adTrash(a.imageId);
  var done = deleteRow('Ads', id);
  CacheService.getScriptCache().remove('ads_pub');
  if (done) audit('ad_delete', 'Ads', id, '', 'حذف إعلان: ' + (a.title || a.titleEn));
  return {ok: done};
}
// the picture is checked by its first bytes (not by the name the browser sent), stored in its own Drive folder and shared view-only
function adImage(o) {
  var data = String(o && o.data || '');
  if (!data || data.length > AD_IMAGE_KB * 1024 * 4 / 3 + 4) return {ok: false, error: 'too_large'};
  var bytes; try { bytes = Utilities.base64Decode(data); } catch (err) { return {ok: false, error: 'bad_image'}; }
  var b = function (i) { return bytes[i] & 255; }, mime = '';
  if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4E && b(3) === 0x47) mime = 'image/png';
  else if (b(0) === 0xFF && b(1) === 0xD8 && b(2) === 0xFF) mime = 'image/jpeg';
  else if (b(0) === 0x52 && b(1) === 0x49 && b(2) === 0x46 && b(3) === 0x46 && b(8) === 0x57 && b(9) === 0x45 && b(10) === 0x42 && b(11) === 0x50) mime = 'image/webp';
  if (!mime) return {ok: false, error: 'bad_image'};
  var p = PropertiesService.getScriptProperties(), fid = p.getProperty('ADS_FOLDER'), folder;
  try { folder = fid && DriveApp.getFolderById(fid); } catch (err) { folder = null; }
  if (!folder) { folder = DriveApp.createFolder(COMPANY + ' - صور الإعلانات'); p.setProperty('ADS_FOLDER', folder.getId()); }
  var file = folder.createFile(Utilities.newBlob(bytes, mime, 'ad-' + Date.now() + '.' + mime.split('/')[1]));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return {ok: true, id: file.getId(), url: 'https://lh3.googleusercontent.com/d/' + file.getId()};
}
function adTrash(id) { try { var f = DriveApp.getFileById(id), fid = prop('ADS_FOLDER'); var ps = f.getParents(); if (ps.hasNext() && ps.next().getId() === fid) f.setTrashed(true); } catch (err) {} }

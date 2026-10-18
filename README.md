# جاهز · Jahiz

شركة وسيطة لبيع المواد والمستلزمات والخدمات عبر مواقع التواصل: تعرض السلع والخدمات، وتستقبل الطلبات، وتحوّلها إلى شركات معتمدة تنفّذها وتوصلها، وتحصل على عمولتها من الشركاء.

- الموقع: https://baseeratactions.github.io/jahiz/
- حسابي (بوابة العميل): https://baseeratactions.github.io/jahiz/portal.html
- لوحة الإدارة: https://baseeratactions.github.io/jahiz/crm.html

## أين أعدّل؟
- الأقسام والمنتجات والخدمات والأسعار ونسب العمولة ومستويات الشراكة: `assets/market-data.js`
- الرقم والبريد ورابط الخادم وحسابات التواصل الاجتماعي (`SOCIAL`): `assets/config.js`
- واجهة السوق: `index.html` و`en/index.html` و`assets/market.js` و`assets/market.css`
- الشعار: `assets/logo-mark.svg` (والأيقونات `assets/icon-*.png` وصور المشاركة `assets/og*.png`)

الطلبات وطلبات انضمام الشركاء تُرسل إلى الخادم `server/Code.gs` (Google Apps Script) كطلبات عادية تظهر في لوحة الإدارة، ونوع العميل «شريك معتمد» يميّز طلبات الانضمام. الموقع يعمل حالياً على خادم بصيرة نفسه (رابط API في `assets/config.js`) إلى أن يُنشأ خادم مستقل لجاهز.

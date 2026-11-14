KM ASCEND ADVISORY — WEBSITE FILES (for kmascend.com)
======================================================

What's inside
  index.html                 the page
  assets/styles.css          design / layout
  assets/main.js             animations, menus, contact form
  assets/img/                logos
  favicon.png                browser tab icon
  .htaccess                  forces https://kmascend.com (hidden file - upload it too)

HOW TO PUBLISH ON GODADDY (Web Hosting / cPanel)
  1. Log in to GoDaddy > My Products > Web Hosting > Manage > cPanel Admin.
  2. Open "File Manager" and go into the  public_html  folder.
  3. Delete any placeholder files there (e.g. default index.html / index.php).
  4. Click "Upload" and upload kmascend-website.zip.
  5. Right-click the zip > "Extract" into public_html, then delete the zip.
     public_html should now directly contain index.html, assets/, favicon.png, .htaccess
     (In File Manager > Settings, tick "Show Hidden Files" to see .htaccess.)
  6. In cPanel > SSL/TLS Status, make sure kmascend.com has a certificate (AutoSSL is free).
  7. Visit https://kmascend.com

  Note: if you only have GoDaddy "Websites + Marketing" (the drag-and-drop builder),
  it can't host uploaded files - you need a Web Hosting (cPanel) plan, or point the
  domain's DNS to another static host (Netlify, Cloudflare Pages, GitHub Pages).

CONTACT FORM
  Enquiries are emailed to khizar@kmascend.com via FormSubmit (formsubmit.co, free).
  ONE-TIME ACTIVATION: after the site is live, submit the form once yourself.
  FormSubmit will send an "Activate Form" email to khizar@kmascend.com - click the
  link in it. From then on every enquiry arrives in that inbox (Reply goes to the visitor).
  To change the address, edit the two lines at the top of assets/main.js.

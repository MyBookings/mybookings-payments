
export function getEmailTemplate({ checkoutUrl, totalValue }) {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Stop Medische Apartheid Ondertekening Petitie</title>
      </head>
      <body style="margin: 0; padding: 0; -webkit-font-smoothing: antialiased; font-family: Verdana, Geneva, sans-serif;">
        <table align="center" border="0" bgcolor="#ffffff" cellpadding="0" cellspacing="0" width="600" style="border: solid 1px #EBEBEB; border-collapse: collapse;">
          <tr>
            <td>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td bgcolor="#C7C7D1" align="left" style="padding: 10px 20px 10px 20px">
                    Klik op de <a href=${checkoutUrl}>Link</a>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#C7C7D1" align="left" style="padding: 10px 20px 10px 20px">
                    Betalen: ${totalValue}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>  
      </body>
    </html>
  `;
};

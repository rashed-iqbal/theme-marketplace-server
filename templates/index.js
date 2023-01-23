module.exports = ({
  plan_price,
  invoice_no,
  user_name,
  createdAt,
  plan_name,
  address,
}) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        * {
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
        }
        @media (min-width: 375px) {
          .invoice-wrapper {
            width: 335px;
            margin: 0 auto;
            margin-top: 40px;
            margin-bottom: 112px;
          }
          .invoice-header h2 {
            text-align: center;
            font-size: 24px;
            line-height: 33px;
          }
          .invoice-header h3 {
            text-align: center;
            font-weight: 400;
            font-size: 14px;
            line-height: 150%;
          }
          .invoice-content {
            margin-top: 32px;
          }
          .left-content h3 {
            font-weight: 700;
            font-size: 16px;
          }
          .right-content h3 {
            font-weight: 700;
            font-size: 16px;
            line-height: 150%;
          }
        }
        @media (min-width: 600px) {
          .invoice-wrapper {
            width: 520px;
            margin: 0 auto;
            margin-top: 48px;
            margin-bottom: 186px;
          }
          .invoice-header h2 {
            text-align: left;
            font-size: 32px;
            line-height: 44px;
          }
          .invoice-header h3 {
            text-align: left;
            font-weight: 600;
            font-size: 18px;
            line-height: 25px;
          }
          .invoice-content {
            margin-top: 60px;
          }
          .left-content h3 {
            font-weight: 600;
            font-size: 24px;
            line-height: 33px;
          }
          .right-content h3 {
            font-weight: 600;
            font-size: 24px;
            line-height: 33px;
          }
        }
        .invoice-header h2 {
          font-family: "Open Sans";
          font-style: normal;
          font-weight: 700;
          color: #1d1d1d;
          margin-bottom: 8px;
        }
        .invoice-header h3 {
          font-family: "Open Sans";
          font-style: normal;
          color: #4f4f4f;
        }
        .left-content {
          float:left
        }
        .right-content {
          float:right
        }
        .left-content h3 {
          font-family: "Open Sans";
          font-style: normal;
          color: #1d1d1d;
          margin-bottom: 8px;
        }
        .left-content h4 {
          font-family: "Open Sans";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 150%;
          color: #383434;
        }
        .right-content h3 {
          font-family: "Open Sans";
          font-style: normal;
          color: #1d1d1d;
          margin-bottom: 8px;
          text-align: right;
        }
        .right-content h4 {
          font-family: "Open Sans";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 150%;
          color: #1d1d1d;
          margin-bottom: 8px;
          text-align: right;
        }
        .invoice-no {
          font-family: "Open Sans";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 150%;
          color: #4f4f4f;
          margin-bottom: 8px;
          text-align: right;
        }
        .status {
          font-family: "Open Sans";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 150%;
          color: #4f4f4f;
          text-align: right;
          margin-bottom: 32px;
        }
        .notes {
          margin-bottom: 40px;
        }
        .notes h3 {
          font-family: "Open Sans";
          font-style: normal;
          font-weight: 700;
          font-size: 16px;
          line-height: 150%;
          color: #1d1d1d;
          margin-bottom: 8px;
        }
        .notes p {
          font-family: "Open Sans";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 150%;
          color: #4f4f4f;
        }
        .footer h2 {
          font-family: "Open Sans";
          font-style: normal;
          font-weight: 600;
          font-size: 18px;
          line-height: 25px;
          text-align: left;
          color: #383434;
        }
        .footer span {
          color: #383434;
          font-weight: 500;
        }
        .table-container {
          margin-bottom: 32px;
        }
        table {
          width: 100%;
          text-align: left;
          background-color: #F1F5FE;
          border-spacing: 0;
          border-collapse: separate;
          border-radius: 4px;
        }
        tr,
        td {
          border-top-left-radius: 10px;
        }
        th,
        td {
          padding: 16px;
          font-family: "Open Sans";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 150%;
          color: #4f4f4f;
        }
        td{
          padding-top: 0px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="invoice-wrapper">
          <div class="invoice-header">
            <h2>${plan_name} plan</h2>
            <h3>${new Date(createdAt).toDateString()}</h3>
          </div>
          <div class="invoice-content">
            <div class="left-content">
              <h3>From</h3>
              <h4>Theme Marketplace</h4>
            </div>
            <div class="right-content">
              <h3>To</h3>
              <h4>${user_name}</h4>
              <p class="invoice-no">Invoice No: #${invoice_no}</p>
              <p class="status">Status: Paid</p>
            </div>
          </div>
          <div class="table-container">
            <table>
              <tr>
                <th>Invoice Name : ${plan_name} plan</th>
              </tr>
              <tr>
                <td>Amount : $${plan_price}</td>
              </tr>
            </table>
          </div>
          <div class="notes">
            <h3>Notes*</h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard
            </p>
          </div>
          <div class="footer">
            <h2>Bill sent by : <span>Theme Marketplace</span></h2>
          </div>
        </div>
      </div>
    </body>
  </html>
    `;
};

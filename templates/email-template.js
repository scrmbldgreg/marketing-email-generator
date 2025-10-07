export function generateTemplate({
  subject,
  preheader,
  campaignCode,
  bannerCode,
  bodyText,
  ctaCode,
  bodyText2Code,
  signoffTitle,
  signoff
}) {
  return `
<!-- AmpScript Codes : BEGIN -->
<div style="display:none;font-size:0px;line-height:0px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: Arial, Helvetica, sans-serif;">

  <!--Email variables : BEGIN -->
  %%[
  VAR @preheader, @slff, @spff, @title

  SET @preheader = "${preheader}"
  SET @spff = "customer.services@lexisnexis.co.uk"
  SET @slff = "Marketing Inquiry [${campaignCode}]"
  SET @title = "${subject}"
  ]%%
  <!--Email variables : END -->

  <!-- AmpScript Email Personalisation : BEGIN -->

  %%[

  SET @isSFdata = 1

  SET @SID_subkey = AttributeValue("SubscriberKey")

  SET @SID_CM1 = AttributeValue("CampaignMember:Common:Id")

  SET @SID_Contact = AttributeValue("Contact:ID")

  SET @SID_lead = AttributeValue("Lead:ID")

  SET @SID_CM2 = AttributeValue("CampaignMember:Id")


  SET @CID_CampId1 = AttributeValue("CampaignId")

  SET @CID_CampId2 = AttributeValue("CampaignMember:CampaignId")

  SET @CID_CampId3 = AttributeValue("CampaignMember:Id")


  IF Not Empty(@SID_SubKey) Then SET @SubscriberKey=@SID_SubKey

  ELSEIF Not Empty(@SID_CM1) Then SET @SubscriberKey=@SID_CM1

  ELSEIF Not Empty(@SID_Contact) Then SET @SubscriberKey=@SID_Contact

  ELSEIF Not Empty(@SID_lead) Then SET @SubscriberKey=@SID_lead

  ELSE

  SET @SIDlookup = RetrieveSalesforceObjects('CampaignMember','LeadOrContactId','id','=',@SID_CM2)

  IF rowcount(@SIDlookup)>0 then

  SET @SIDRow = Row(@SIDlookup,1)

  SET @SubscriberKey = Field(@SIDRow,'LeadOrContactId')

  ELSE

  SET @isSFdata = 0

  ENDIF

  ENDIF


  IF Not Empty(@CID_CampId1) Then SET @Campaignid=@CID_CampId1

  ELSEIF Not Empty(@CID_CampId2) Then SET @Campaignid=@CID_CampId2

  ELSE

  SET @CIDlookup = RetrieveSalesforceObjects('CampaignMember','Campaignid','id','=',@CID_CampId3)

  IF rowcount(@CIDlookup)>0 then

  SET @CIDRow = Row(@CIDlookup,1)

  SET @Campaignid = Field(@CIDRow,'Campaignid')

  ELSE

  SET @isSFdata = 0

  ENDIF

  ENDIF


  IF Not Empty(@SubscriberKey) AND Not Empty(@CampaignId) Then SET @SyncData = LookUpRows("ENT.CampaignMember_Salesforce","CampaignId",@CampaignId,"LeadOrContactId",@SubscriberKey) IF RowCount(@SyncData) > 0 Then

  SET @FirstName = Field(Row(@SyncData,1),"Campaign_FirstName__c")

  SET @LastName = Field(Row(@SyncData,1),"Campaign_LastName__c")

  SET @Organisation = Field(Row(@SyncData,1),"Campaign_Organisation__c")

  SET @JobFunction = Field(Row(@SyncData,1),"Campaign_JobFunction__c")

  SET @RepName = Field(Row(@SyncData,1),"Campaign_RepName__c")

  SET @RepCode = Field(Row(@SyncData,1),"Campaign_Repcode__c")

  SET @SecSubClass = Field(Row(@SyncData,1),"Campaign_Sec_SubClass__c")

  Else

  SET @SalesforceData = RetrieveSalesforceObjects("CampaignMember","Id,Campaign_FirstName__c,Campaign_LastName__c,Campaign_Organisation__c,Campaign_JobFunction__c,Campaign_RepName__c,Campaign_Repcode__c,Campaign_Sec_SubClass__c","CampaignId","=",@CampaignId,"LeadOrContactId","=",@SubscriberKey) IF RowCount(@SalesforceData) > 0 Then

  SET @FirstName = Field(Row(@SalesforceData,1),"Campaign_FirstName__c")

  SET @LastName = Field(Row(@SalesforceData,1),"Campaign_LastName__c")

  SET @Organisation = Field(Row(@SalesforceData,1),"Campaign_Organisation__c")

  SET @JobFunction = Field(Row(@SalesforceData,1),"Campaign_JobFunction__c")

  SET @RepName = Field(Row(@SalesforceData,1),"Campaign_RepName__c")

  SET @RepCode = Field(Row(@SalesforceData,1),"Campaign_Repcode__c")

  SET @SecSubClass = Field(Row(@SalesforceData,1),"Campaign_Sec_SubClass__c")

  EndIF

  EndIF

  EndIF ]%%

  <!-- AmpScript Email Personalisation : END -->

  <!-- FirstName personalisation: START -->
  %%[
  VAR @fname
  SET @fname = @FirstName

  IF Empty(@fname) THEN SET @fname = ""
  ELSE SET @fname = @FirstName
  ENDIF

  VAR @fnameTemp, @f_name, @fn1, @fn2, @fn3
  SET @fn1 = AttributeValue("FIRSTNAME")
  SET @fn2 = AttributeValue("FIRST_NAME")
  SET @fn3 = AttributeValue("FIRST NAME")
  IF Not Empty(@fn1)
  THEN SET @fnameTemp = @fn1
  ELSEIF Not Empty(@fn2)
  THEN SET @fnameTemp = @fn2
  ELSEIF Not Empty(@fn3)
  THEN SET @fnameTemp = @fn3
  ENDIF
  SET @f_name = ProperCase(@fnameTemp)
  ]%%
  <!-- FirstName personalisation: END -->
  %%[        
        VAR @key
        SET @key = AttributeValue("SubscriberKey")
  ]%%

</div>
<!-- AmpScript Codes : END -->
<html>
<head>
  <meta charset="utf-8">
  <!-- utf-8 works for most cases -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Forcing initial-scale shouldn't be necessary -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!-- Use the latest (edge) version of IE rendering engine -->
  <title>%%=v(@title)=%%</title>
  <!-- The title tag shows in email notifications, like Android 4.4. -->
  <!-- Please use an inliner tool to convert all CSS to inline as inpage or external CSS is removed by email clients -->
  <!-- important in CSS is used to prevent the styles of currently inline CSS from overriding the ones mentioned in media queries when corresponding screen sizes are encountered -->
  
  <!-- CSS Reset -->
  <style type="text/css">
    /* What it does: Remove spaces around the email design added by some email clients. */
    /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
    html,  body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
    }


    /* OVERRIDE ALL LINK STYLING */
    u + #body a {
      color: inherit;
      text-decoration: none;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      line-height: inherit;
    }
    /* What it does: Stops email clients resizing small text. */
    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    /* What it does: Forces Outlook.com to display emails full width. */
    .ExternalClass {
      width: 100%;
    }
    /* What is does: Centers email on Android 4.4 */
    div[style*="margin: 16px 0"] {
      margin: 0 !important;
    }
    /* What it does: Stops Outlook from adding extra spacing to tables. */
    table,  td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }
    /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
    table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
    }
    table table table {
      table-layout: auto;
    }
    /* What it does: Uses a better rendering method when resizing images in IE. */
    img {
      -ms-interpolation-mode: bicubic;
    }
    /* What it does: Overrides styles added when Yahoo's auto-senses a link. */
    .yshortcuts a {
      border-bottom: none !important;
    }
    /* What it does: Another work-around for iOS meddling in triggered links. */
    a[x-apple-data-detectors] {
      color: inherit !important;
    }
  </style>
  
  <!-- Progressive Enhancements -->
  <style type="text/css">

    /* What it does: Hover styles for buttons */
    .button-td,
    .button-a {
      transition: all 100ms ease-in;
    }
    .button-td:hover,
    .button-a:hover {
      background: #E11119 !important;
      border-color: #E11119 !important;
    }

    /* What it does: Hover styles for buttonsv2 */
    .button-tdv2,
    .button-av2 {
      transition: all 100ms ease-in;
    }
    .button-tdv2:hover,
    .button-av2:hover {
      background: #2D2D2F !important;
      border-color: #2D2D2F !important;
    }

    /* Media Queries */
    @media screen and (max-width: 650px) {

      .email-container {
        width: 95% !important;
      }
      .columnn{
        max-width: 100% !important;
        
      }

      #columnn1{
        padding-left: 15px !important;
      }
      #columnn2{
        text-align: left !important;
        padding-left: 10px !important;

      }

      .two-column .column {
        max-width: 50% !important;
      }
      .two-columnbb .column {
        max-width: 50% !important;
      }
      .three-column .column {
        max-width: 33% !important;
      }
      .three-columnfjf .column {
        max-width: 50% !important;
      }
      .three-columnlll .column {
        max-width: 50% !important;
      }
      .third {
        text-align: center !important;
        display: block !important;
        margin-left: auto !important;
        margin-right: auto !important;
        float: none !important;
      }

    }
    @media screen and (max-width: 590px) {

      .email-container {
        width: 95% !important;
      }
      .second {
        text-align: center !important;
        display: block !important;
        margin-left: auto !important;
        margin-right: auto !important;
        float: none !important;
      }

      .two-columnbb{
        padding-top: 0px !important;
      }

    }

    @media screen and (max-width: 580px) {

      /* What it does: Forces table cells into full-width rows. */
      .stack-column,
      .stack-column-center {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        direction: ltr !important;
      }
      /* And center justify these ones. */
      .stack-column-center {
        text-align: center !important;
      }

      /* What it does: Generic utility class for centering. Useful for images, buttons, and nested tables. */
      .center-on-narrow {
        text-align: center !important;
        display: block !important;
        margin-left: auto !important;
        margin-right: auto !important;
        float: none !important;
      }
      table.center-on-narrow {
        display: inline-block !important;
      }
      
      .two-column .column {
        max-width: 100% !important;
      }
      
      .three-column .column {
        max-width: 100% !important;
      }
      
      .three-columnfjf .column {
        max-width: 100% !important;
      }
      
      .three-columnlll .column {
        max-width: 100% !important;
      }
      
      .two-columnbb .column {
        max-width: 100% !important;
      }
      
      .two-columnbb img {
        max-width: 100% !important;
      }
      
    }

    @media screen and (max-width: 400px) {

      /* What it does: Generic utility class for centering. Useful for images, buttons, and nested tables. */
      .center-on-narrower {
        text-align: center !important;
        display: block !important;
        margin-left: auto !important;
        margin-right: auto !important;
        float: none !important;
      }
      table.center-on-narrower {
        display: inline-block !important;
      }
    }
  </style>
      <!--[if gte mso 9]>
      <style>
      li {
      text-indent: -1em; /* Normalise space between bullets and text */
      }
      </style>
    <![endif]-->

      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">

    </head>
    <body bgcolor="#e8e9eb" width="100%" style="margin: 0;" yahoo="yahoo" id="body">

      <!-- PRE HEADER -->
      <module name="preheader" label="Preheader">

        <div style="display: none; max-height: 0px; overflow: hidden;">

          <editable name="preheader">%%=v(@preheader)=%%</editable>

          &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;

          &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;

          &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;

        </div>

      </module>

      <table bgcolor="#e8e9eb" cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" style="border-collapse:collapse;">
        <tr>
          <td>
            <center style="width: 100%;">
              <!-- Pre-heading : BEGIN -->
              <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#e8e9eb" width="600" class="email-container">
                <!-- Pre-heading : BEGIN -->
                <tr>
                  <td align="center" valign="top" width="100%" style="padding: 20px 0px 20px 0px;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td valign="top" width="100%" class="stack-column-center">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; mso-height-rule: exactly; line-height: 16px; color: #040404; padding: 0px 0px 0px 0px; text-align: center;" class="center-on-narrower">
                                <a href="%%view_email_url%%" name="viewInBrowser" target="_blank" style="color:#040404;text-decoration:underline">View&nbsp;in&nbsp;browser</a>&nbsp;|&nbsp;<a href="mailto:%%=v(@spff)=%%?subject=%%=v(@slff)=%%" target="_blank" style="color:#040404;text-decoration:underline">Reply&nbsp;to&nbsp;this&nbsp;email</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Pre-heading : END -->
              </table>
              <!-- Pre-heading : END --> 


              <!-- Email Body : BEGIN -->
              <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="600" class="email-container">

               <!-- Logo + socials : BEGIN -->
                <tr>
                    <td bgcolor="#ffffff" style="padding-bottom: 0px;">
                        <a href="https://www.lexisnexis.co.uk/" target="_blank">
                            <img src="https://image.m.lexisnexis.co.uk/lib/fe951372746d057f71/m/1/0fc89892-b71f-432c-967c-356444e83543.png" alt="" title="" width="600" border="0" align="center" style="width: 100%; max-width: 600px; height: auto;">
                        </a>
                    </td>
                </tr>
              <!-- Logo + socials : END -->

              <!-- Hero Image, Flush : BEGIN -->
              <tr>
                <td bgcolor="#ffffff" style="padding-bottom: 0px;">
                  <div style="display:none;">
                    %%[ SET @protege = "<a href='https://www.lexisnexis.co.uk/solutions/protege?utm_source=email&utm_medium=email&utm_content=_&utm_campaign=604407_protegelaunchcampaigncrosspromotionbanner' target='_blank'>
                      <img src='https://image.m.lexisnexis.co.uk/lib/fe951372746d057f71/m/1/63da846e-465e-44ca-9335-c0b192d4ffba.jpg' alt='' title='' width='600' border='0' align='center' style='width: 100%; max-width: 600px; height: auto;'>
                    </a>"
                    ]%%
                  </div>
                  %%=v(@protege)=%%
                </td>
              </tr>
              <!-- Hero Image, Flush : END -->

                  ${bannerCode}


              <!-- 1 Column Text : BEGIN -->
              <tr>
                <td style="padding: 30px 30px 0px 30px; text-align: left; font-family: 'Lato', Arial, sans-serif; font-size: 14px; mso-height-rule: exactly; line-height: 20px; color: #000000;">

                  %%[IF NOT EMPTY(@f_name) THEN ]%% Dear %%=v(@f_name)=%%, %%[ELSE]%% Hello, %%[ENDIF]%%
                  <br/><br/>

                  ${bodyText}
                </td>
              </tr>
              <!-- 1 Column Text : END -->
                  ${ctaCode}

                  ${bodyText2Code}
              <!-- 1 Column Text : BEGIN -->  
                <tr>
                  <td style="padding: 20px 30px 30px 30px; text-align: left; font-family: 'Lato', Arial, sans-serif; font-size: 14px; mso-height-rule: exactly; line-height: 20px; color: #000000;">

                    Kind regards,<br/><br/>
                    <strong>${signoff}</strong><br/>
                    ${signoffTitle}

                  </td>
                </tr>
              <!-- 1 Column Text : END -->
              <!-- Logo + socials : BEGIN -->
                <tr>
                  <!-- Note: set font-size: 0 to get rid of any gaps between our columns inside this cell -->
                    <td bgcolor="#00172E" style="padding: 20px 30px 0px 30px; text-align: center; font-size: 0;" class="two-column">
                      <!--[if (gte mso 9)|(IE)]>
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                          <td width="50%" valign="top">
                          <![endif]-->

                            <div style="width: 100%; max-width: 270px; display: inline-block; vertical-align: top;" class="column">
                              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td align="left" style="padding-bottom: 10px; text-align: left; font-family: Arial, Helvetica, sans-serif; font-size: 14px; mso-height-rule: exactly; color: #000000;">
                                    <a href="https://www.lexisnexis.co.uk/home" target="_blank"><img src="https://image.m.lexisnexis.co.uk/lib/fe951372746d057f71/m/4/040c377b-5a93-4ebf-bc4c-67a69c380a50.png"  alt="LexisNexis" title="LexisNexis" width="140" border="0" align="center" style="width: 100%; max-width: 140px; height: auto;" class="center-on-narrow"></a>
                                  </td>
                                </tr>
                              </table>
                            </div>

                          <!--[if (gte mso 9)|(IE)]>
                          </td>
                          <td width="50%" valign="top">
                          <![endif]-->

                            <div style="width: 100%; max-width: 270px; display: inline-block; vertical-align: top;" class="column">
                              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td align="right" style="padding-top: 4px; padding-bottom: 20px;" class="center-on-narrow">
                                    <table align="right" cellpadding="0" cellspacing="0" border="0" width="60" class="center-on-narrow">
                                      <tr>
                                        <td style="padding: 0 2px;">
                                          <a href="https://twitter.com/LexisNexisUK" target="_blank"><img border="0" src="https://image.m.lexisnexis.co.uk/lib/fe951372746d057f71/m/1/e318431f-803d-475a-b372-ed172305d938.png" alt="Twitter" title="Twitter" name="Twitter" width="26" height="26" /></a>
                                        </td>
                                        <td style="padding: 0 2px;">
                                          <a href="https://www.linkedin.com/company/lexisnexis-uk" target="_blank"><img border="0" src="https://image.m.lexisnexis.co.uk/lib/fe951372746d057f71/m/6/d0cd2e4d-fe3b-43de-8199-37b993f99277.png" alt="LinkedIn" title="LinkedIn" name="LinkedIn" width="26" height="26" /></a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table> 
                            </div>

                      <!--[if (gte mso 9)|(IE)]>
                          </td>
                      </tr>
                      </table>
                    <![endif]-->
                    </td>
                  </tr>
                  <!-- Logo + socials : END --> 

      </table>
      <!-- Email Body : END -->

<!-- Disclaimer : BEGIN -->
<table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#e8e9eb" width="630" class="email-container">
  <!-- Disclaimer : BEGIN -->
  <tr>
    <td style="padding: 20px 15px 30px 15px; text-align: left; font-family: Arial, Helvetica, sans-serif; font-size: 12px; mso-height-rule: exactly; line-height: 16px; color: #040404;">
      This e-mail was sent to <a href="mailto:%%emailaddr%%" style="text-decoration: none; color: #040404;" target="_blank">%%emailaddr%%</a>. 
      <br /><br />
      PLEASE DO NOT REPLY TO THIS EMAIL. 
      <br /><br />
      <a href="https://www.lexisnexis.co.uk/about-us/about-us" style="color: #040404; text-decoration: underline; font-weight: normal;" target="_blank">About LexisNexis</a> | <a href="https://www.lexisnexis.co.uk/terms" style="color: #040404; text-decoration: underline; font-weight: normal;" target="_blank">Terms & Conditions</a> | <a href="mailto:%%=v(@spff)=%%?subject=%%=v(@slff)=%%" style="color: #040404; text-decoration: underline; font-weight: normal;" target="_blank">Contact Us</a> | <a href="https://www.lexisnexis.com/global/privacy/privacy-policy.page" style="color: #040404; text-decoration: underline; font-weight: normal;" target="_blank">Privacy Policy</a> | <a href="https://stayintouch.lexisnexis.co.uk/" style="color: #040404; text-decoration: underline; font-weight: normal;" target="_blank">Manage communication preferences</a>
      <br/>      
      <a href="%%=RedirectTo(CloudPagesURL(9097))=%%" name="Opt-out" target="_blank" style="color: #040404; text-decoration: underline; font-weight: normal;">Unsubscribe</a>
      <br /><br />
      RELX (UK) Limited, trading as LexisNexis<sup>&reg;</sup>. Registered office 1-3 Strand London WC2N 5JR. Registered in England number 2746621. VAT Registered No. GB 730 8595 20. LexisNexis and the Knowledge Burst logo are registered trademarks of RELX Inc. &copy; %%=FormatDate(Now(), "YYYY")=%% LexisNexis. The information in this email is current as of %%=FormatDate(Now(), "MMMM YYYY")=%% and is subject to change without&nbsp;notice.
    </td>
  </tr>
  <!-- Disclaimer : END --> 
</table>
<!-- Disclaimer : END -->
</center>
</td>
</tr>
</table>
<custom name="opencounter" type="tracking"></custom>
</body>
</html>


`;
}

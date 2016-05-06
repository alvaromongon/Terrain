using System;
using System.Configuration;
using System.Net;
using System.Net.Mail;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces.Internals;

namespace TerrainGenerator.Services.Implementations
{
    public class AccountNotificationService : IAccountNotificationService
    {
        private const string AccountVerificationSubject = "Account verification";
        private const string AccountVerificationBody = "Please, very your account following this link: ";

        public void SendActivationRequest(Account account, Uri activationUri)
        {
            var client = new SmtpClient
            {
                Host = ConfigurationManager.AppSettings.Get(ConfigurationKeys.SmtpServer),
                Port = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.SmtpServerPort)),
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Credentials = new NetworkCredential(ConfigurationManager.AppSettings.Get(ConfigurationKeys.SmtpAccount),
                            ConfigurationManager.AppSettings.Get(ConfigurationKeys.SmtpAccountPassword)),
                EnableSsl = true,
                Timeout = 10000
            };
            var mail = new MailMessage
            {
                From = new MailAddress(ConfigurationManager.AppSettings.Get(ConfigurationKeys.SmtpAccount))
            };
            mail.To.Add(account.AccountId);
            mail.Subject = AccountVerificationSubject;

            if (activationUri.ToString().EndsWith("/"))
            {
                mail.Body = AccountVerificationBody + activationUri + account.ActivationId;
            }
            else
            {
                mail.Body = AccountVerificationBody + activationUri + "/" + account.ActivationId;
            }

            // possible SmtpException
            client.Send(mail);
        }
    }
}

class UserMailer < ActionMailer::Base
  default from: "hello@unisphere.eu"
  
  def welcome_email(password, organization, email)
    @password = password
    @organization = organization
    @email = email
    mail(to: email, subject: 'Welcome to Unisphere')
  end
  
end
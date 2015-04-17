class UserMailer < ActionMailer::Base
  default from: "hello@unisphere.eu"
  
  def welcome_email(password, organization, email, url)
    @password = password
    @organization = organization
    @email = email
    @url = url
    mail(to: email, subject: 'Welcome to Unisphere')
  end
  
  def password_forgoten_email(email, organization)
    @organization = organization.name
    @password = organization.users.find_by_email(email).access_alias
    @url = "http://#{organization.subdomain}.unisphere.eu"
    mail(to: email, subject: 'Password forgoten')
  end
  
end
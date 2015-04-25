class UserMailer < ActionMailer::Base
  include ApplicationHelper
  default from: "hello@unisphere.eu"
  
  def welcome_email(organization, email, url)
    @organization = organization
    @email = email
    @url = url
    mail(to: email, subject: 'Welcome to Unisphere')
  end
  
  def password_forgoten_email(email, organization)
    @organization = organization.name
    @password = forgot_password(email)
    @url = "http://#{organization.subdomain}.unisphere.eu"
    mail(to: email, subject: 'Password forgoten')
  end
  
  def activity_email(user)
    report = user.reports.last
    @downloads_count = report.downloads
    chapters = user.chapters
    @chapters_count = user.chapters.count
    @organization_name = Organization.find(user.organization_id).name
    @views_count = report.views
    
    @uploads_count = 0
    chapters.each do |chapter|
      @uploads_count += chapter.awsdocuments.where(['created_at > ?', 7.days.ago]).count
    end
    
    mail(to: user.email, subject: "Weekly #{@organization_name} activity")
  end
  
  def invite_user_email(email, organization, password)
    @organization = organization.name
    @password = password
    mail(to: email, subject: 'Invitation to join Unisphere')
  end
  
end
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
    organization = Organization.find user.organization_id
    report = user.reports.last
    nodes = organization.nodes.where(['created_at > ?', 7.days.ago])
    
    @chapters = 0
    nodes.each do |node|
      @chapters += node.chapters.count
    end
    
    @uploads = 0
    nodes.each do |node|
      chapters = node.chapters
      chapters.each do |chapter|
        @uploads += chapter.awsdocuments.where(['created_at > ?', 7.days.ago]).count
      end
    end
    
    @downloads = report.downloads
    @organization = organization.name
    @nodes = nodes.count
    @views = report.views
    
    mail(to: email, subject: "Weekly #{@organization} activity")
  end
  
  def invite_user_email(email, organization, password)
    @organization = organization.name
    @password = password
    mail(to: email, subject: 'Invitation to join Unisphere')
  end
  
end
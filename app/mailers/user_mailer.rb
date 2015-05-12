class UserMailer < ActionMailer::Base
  include ApplicationHelper
  default from: "hello@unisphere.eu"
  
  def activity_email(user)
    @organization = current_organization
    @nodes_activity = []
    @url = "http://#{organization.subdomain}.unisphere.eu"
    user_nodes.each do |node|
      @nodes_activity << {name: node.name, parent: Node.find(node.parent_id), downloads: node.reports.last.downloads}
    end
    mail(to: user.email, subject: "Weekly #{@organization.name} activity")
  end
  
  def invite_user_email(email, organization, password)
    @organization = organization.name
    @password = password
    mail(to: email, subject: 'Invitation to join Unisphere')
  end
  
end
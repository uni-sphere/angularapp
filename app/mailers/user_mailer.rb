class UserMailer < ActionMailer::Base
  include ApplicationHelper
  include AuthenticationHelper
  default from: "hello@unisphere.eu"

  def activity_email(user)
    user.organizations.each do |organization|
      @organization = organization
      @nodes_activity = []
      @url = "http://#{organization.subdomain}.unisphere.eu"
      user_nodes_email(user.id).each do |node|
        @nodes_activity << {name: node.name, parent: Node.find(node.parent_id).name, downloads: node.reports.last.downloads} if node.reports.exists?
      end
      mail(to: user.email, subject: "Weekly activity #{@organization.name}") if (Time.now - organization.created_at).abs > 6.days
    end
  end

  def invite_user_email(user, email, organization, password)
    @organization = organization
    @password = password
    @user = user
    mail(to: email, subject: user.name.nil? ? user.email + ' | Join Unisphere!' : user.name + ' | Join Unisphere!')
  end

  def welcome_email(id, organization)
    @user = User.find id
    @organization = Organization.find organization
    mail(to: @user.email, subject: 'Welcome to Unisphere')
  end

end

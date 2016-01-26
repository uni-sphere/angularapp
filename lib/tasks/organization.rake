require "#{Rails.root}/app/helpers/subdomain_helper"
include SubdomainHelper

# use case
# rake organization:create["ifma", "http://ifma.unisphere.eu", 29.778004, -95.544143]

namespace :organization do
  desc "create organization"
  task :create, [:name, :website, :latitude, :longitude] => :environment do |t, args|
    organization = Organization.new(name: args.name, latitude: args.latitude, longitude: args.longitude, website: args.website)
    organization.organizationsuserslinks.build(user_id: User.find_by_email('hello@unisphere.eu').id)
    organization.organizationsuserslinks.build(user_id: User.find_by_email('superadmin@unisphere.eu').id)
    organization.organizationsuserslinks.build(user_id: User.find_by_email('teacher@unisphere.eu').id)
    user = User.find_by_email('hello@unisphere.eu')
    organization.nodes.new(name: args.name, parent_id: 0, user_id: user.id)
    if organization.save
      node = organization.nodes.where(archived: false).first
      firstchild = organization.nodes.new(name: 'First Level', parent_id: node.id, user_id: user.id)
      firstchild.chapters.build(title: 'main', parent_id: 0, user_id: user.id)
      secondchild = organization.nodes.new(name: 'Second Level', parent_id: node.id, user_id: user.id)
      secondchild.chapters.build(title: 'main', parent_id: 0, user_id: user.id)
      if firstchild.save and secondchild.save
        if true #create_pointer(organization.subdomain)
          Rollbar.info("Organization created", organization: organization.name)
        else
          firstchild.destroy
          secondchild.destroy
          node.destroy
          organization.destroy
        end
      else
        node.destroy
        organization.destroy
      end
    end
  end

end

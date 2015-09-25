require "#{Rails.root}/app/helpers/subdomaindev_helper"
include SubdomaindevHelper

def add_reports(node)
  for i in 1..10
    node.reports.create(downloads: Random.rand(50))
    report = Report.last
    date = report.created_at-(11-i)*7.days
    report.update(created_at: date)
  end
end

namespace :local do
  desc "reset"
  task reset: :environment do
    # clear db
    Rake::Task["db:drop"].invoke
    Rake::Task["db:create"].invoke
    Rake::Task["db:migrate"].invoke
    # reset domains
    # dev_reset_pointers
    # create sandbox
    organization = Organization.create(name: 'Sandbox', website: 'http://sandbox.unisphere.eu', created_at: Time.now-12*7.days)
    # Create a user
    organization.users.create!(email: "hello@unisphere.eu", name: "Hello", uid: "foo", provider: 'email', password: 'gabgabgab', help: false, superadmin: true)
    organization.users.create!(email: "gabriel.muller@unisphere.eu", name: "Gab", uid: "bar", provider: 'email', password: 'gabgabgab', help: false, superadmin: false)
    organization.users.create!(email: "user@unisphere.eu", name: "User", uid: "foo", provider: 'email', password: 'gabgabgab', help: false, superadmin: true)
    
    #create initial data
    user = User.find_by_email('hello@unisphere.eu')
    node = organization.nodes.create(name: 'University', parent_id: 0, user_id: user.id)
    # create nodes
    parent_2 = organization.nodes.create(name: "Seconde", parent_id: node.id, user_id: user.id)
    parent_3 = organization.nodes.create(name: "Premiere", parent_id: node.id, user_id: user.id)
    parent_4 = organization.nodes.create(name: "Terminal", parent_id: node.id, user_id: user.id)
    #
    node_chap = organization.nodes.create(name: "Histoire", parent_id: parent_2.id, user_id: user.id)
    add_reports(node_chap)
    parent_chap = node_chap.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Français", parent_id: parent_2.id, user_id: user.id)
    add_reports(node)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Physique", parent_id: parent_2.id, user_id: user.id)
    add_reports(node)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Biologie", parent_id: parent_2.id, user_id: user.id)
    add_reports(node)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    #
    parent_9 = organization.nodes.create(name: "S", parent_id: parent_3.id, user_id: user.id)
    node = organization.nodes.create(name: "ES", parent_id: parent_3.id, user_id: user.id)
    add_reports(node)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "L", parent_id: parent_3.id, user_id: user.id)
    add_reports(node)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    #
    node = organization.nodes.create(name: "S", parent_id: parent_4.id, user_id: user.id)
    add_reports(node)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "ES", parent_id: parent_4.id, user_id: user.id)
    add_reports(node)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "L", parent_id: parent_4.id, user_id: user.id)
    add_reports(node)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    # create topics
    node = organization.nodes.create(name: "Maths", parent_id: parent_9.id, user_id: user.id)
    add_reports(node)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Anglais", parent_id: parent_9.id, user_id: user.id)
    add_reports(node)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Histoire", parent_id: parent_9.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    add_reports(node)
    # create chapters
    parent_13 = node_chap.chapters.create(title: "Les rois de France", parent_id: parent_chap.id, user_id: user.id)
    node_chap.chapters.create(title: "Cours", parent_id: parent_13.id, user_id: user.id)
    node_chap.chapters.create(title: "Images", parent_id: parent_13.id, user_id: user.id)
    parent_16 = node_chap.chapters.create(title: "Le continent Africain", parent_id: parent_chap.id, user_id: user.id)
    node_chap.chapters.create(title: "Cours", parent_id: parent_16.id, user_id: user.id)
    node_chap.chapters.create(title: "Exercices", parent_id: parent_16.id, user_id: user.id)
    parent_19 = node_chap.chapters.create(title: "La guerre de 100 ans", parent_id: parent_chap.id, user_id: user.id)
    node_chap.chapters.create(title: "Cours", parent_id: parent_19.id, user_id: user.id)
    node_chap.chapters.create(title: "Videos", parent_id: parent_19.id, user_id: user.id)
    parent_22 = node_chap.chapters.create(title: "Annexes", parent_id: parent_chap.id, user_id: user.id)
    node_chap.chapters.create(title: "Cours", parent_id: parent_22.id, user_id: user.id)
    node_chap.chapters.create(title: "Annexes", parent_id: parent_22.id, user_id: user.id)
    
    #ifma
    user = User.find_by_email('hello@unisphere.eu')
    # organization = Organization.create(name: 'IFMA', website: 'https://www.ifma.fr', latitude: "45.757656", longitude: "3.112736000000041", place_id: "ChIJzTllBHAc90cRUtUbHjJFpl0")
    # organization.organizationsuserslinks.create(user_id: User.find_by_email('gabriel.muller@unisphere.eu'))
    # organization.organizationsuserslinks.create(user_id: user.id)
    # organization.nodes.create(name: 'IFMA', parent_id: 0, user_id: user.id)
    # node = organization.nodes.where(archived: false).first
    # firstchild = organization.nodes.create(name: 'First Level', parent_id: node.id, user_id: user.id)
    # firstchild.chapters.create(title: 'main', parent_id: 0, user_id: user.id)
    # secondchild = organization.nodes.create(name: 'Second Level', parent_id: node.id, user_id: user.id)
    # secondchild.chapters.create(title: 'main', parent_id: 0, user_id: user.id)

  end

end

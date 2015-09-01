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

namespace :filldev do
  desc "inital filling"
  task initial: :environment do
    # clear db
    Rake::Task["db:drop"].invoke
    Rake::Task["db:create"].invoke
    Rake::Task["db:migrate"].invoke
    # reset domains
    # dev_reset_pointers
    # create sandbox
    organization = Organization.create(name: 'Sandbox', website: 'http://sandbox.unisphere.eu', created_at: Time.now-12*7.days)
    # Create a user
    organization.users.create!(email: "teacher@university.com", name: "Teacher", uid: "foo", provider: 'email', password: 'teacher', help: false)
    organization.users.create!(email: "hello@unisphere.eu", name: "Hello", uid: "foo", provider: 'email', password: 'gabgabgab', help: false, superadmin: true)
    # create first nodes
    organization.nodes.create(name: "Sandbox", parent_id: 0, user_id: 1)
    # create nodes
    organization.nodes.create(name: "Seconde", parent_id: 1, user_id: 1)
    organization.nodes.create(name: "Premiere", parent_id: 1, user_id: 1)
    organization.nodes.create(name: "Terminal", parent_id: 1, user_id: 1)
    #
    organization.nodes.create(name: "1", parent_id: 2, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "2", parent_id: 2, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "3", parent_id: 2, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "4", parent_id: 2, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    #
    organization.nodes.create(name: "S", parent_id: 3, user_id: 1)
    organization.nodes.create(name: "ES", parent_id: 3, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "L", parent_id: 3, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    #
    organization.nodes.create(name: "S", parent_id: 4, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "ES", parent_id: 4, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "L", parent_id: 4, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    # create topics
    organization.nodes.create(name: "Maths", parent_id: 9, user_id: 1)
    # add_reports(Node.last)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "Anglais", parent_id: 9, user_id: 1)
    # add_reports(Node.last)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "Histoire", parent_id: 9, user_id: 1)
    add_reports(Node.last)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    # create chapters
    node = Organization.last.nodes.last
    node.chapters.create(title: "Les rois de France", parent_id: 11, user_id: 1)
    node.chapters.create(title: "Cours", parent_id: 13, user_id: 1)
    node.chapters.create(title: "Images", parent_id: 13, user_id: 1)
    node.chapters.create(title: "Le continent Africain", parent_id: 11, user_id: 1)
    node.chapters.create(title: "Cours", parent_id: 16, user_id: 1)
    node.chapters.create(title: "Exercices", parent_id: 16, user_id: 1)
    node.chapters.create(title: "La guerre de 100 ans", parent_id: 11, user_id: 1)
    node.chapters.create(title: "Cours", parent_id: 19, user_id: 1)
    node.chapters.create(title: "Videos", parent_id: 19, user_id: 1)
    node.chapters.create(title: "Preparation BAC", parent_id: 11, user_id: 1)
    node.chapters.create(title: "Cours", parent_id: 22, user_id: 1)
    node.chapters.create(title: "Annexes", parent_id: 22, user_id: 1)
  end

end

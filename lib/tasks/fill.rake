require "#{Rails.root}/app/helpers/subdomain_helper"
include SubdomainHelper

def add_reports(node)
  for i in 1..10
    node.reports.create(downloads: Random.rand(50))
    report = Report.last
    date = report.created_at-(11-i)*7.days
    report.update(created_at: date)
  end
end

namespace :fill do
  desc "inital filling"
  task initial: :environment do
    # clear db
    Rake::Task["db:drop"].invoke
    Rake::Task["db:create"].invoke
    Rake::Task["db:migrate"].invoke
    # reset domains
    reset_pointers
    # create sandbox
    organization = Organization.create(name: 'Sandbox', website: 'http://sandbox.unisphere.eu', created_at: Time.now-12*7.days)
    # Create a user
    organization.users.create!(email: "teacher@university.com", name: "Teacher", uid: "foo", provider: 'email', password: 'teacher', help: false)
    organization.users.create!(email: "clement.muller@unisphere.eu", name: "Unisphere", uid: "foo", provider: 'email', password: 'clementmuller', help: false)
    # create first nodes
    organization.nodes.create(name: "Sandbox", parent_id: 0, user_id: 1)
    # create nodes
    organization.nodes.create(name: "BSc", parent_id: 131, user_id: 1)
    organization.nodes.create(name: "MSc", parent_id: 131, user_id: 1)
    organization.nodes.create(name: "PhD", parent_id: 131, user_id: 1)
    #
    organization.nodes.create(name: "1st year", parent_id: 132, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "2nd year", parent_id: 132, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "3nd year", parent_id: 132, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    #
    organization.nodes.create(name: "1st year", parent_id: 133, user_id: 1)
    organization.nodes.create(name: "2nd year", parent_id: 133, user_id: 1)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    # create topics
    organization.nodes.create(name: "Maths", parent_id: 137, user_id: 1)
    # add_reports(Node.last)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "Biology", parent_id: 137, user_id: 1)
    # add_reports(Node.last)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "History", parent_id: 137, user_id: 1)
    add_reports(Node.last)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    # create chapters
    node = Organization.last.nodes.last
    node.chapters.create(title: "Europe", parent_id: 158, user_id: 1)
    node.chapters.create(title: "Lesson", parent_id: 159, user_id: 1)
    node.chapters.create(title: "Images", parent_id: 159, user_id: 1)
    node.chapters.create(title: "The industrial revolution", parent_id: 158, user_id: 1)
    node.chapters.create(title: "Lesson", parent_id: 162, user_id: 1)
    node.chapters.create(title: "Exercices", parent_id: 162, user_id: 1)
    node.chapters.create(title: "Hundred Years' War", parent_id: 158, user_id: 1)
    node.chapters.create(title: "Lesson", parent_id: 165, user_id: 1)
    node.chapters.create(title: "Videos", parent_id: 165, user_id: 1)
    node.chapters.create(title: "Exams", parent_id: 158, user_id: 1)
    node.chapters.create(title: "Lesson", parent_id: 168, user_id: 1)
    node.chapters.create(title: "Images", parent_id: 168, user_id: 1)
  end

end

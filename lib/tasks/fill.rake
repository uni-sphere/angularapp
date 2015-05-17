require "#{Rails.root}/app/helpers/subdomain_helper"
include SubdomainHelper

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
    organization = Organization.create(name: 'Sandbox', website: 'http://sandbox.unisphere.eu')
    # create first nodes
    organization.nodes.create(name: "Sandbox", parent_id: 0)
    # create nodes
    organization.nodes.create(name: "Seconde", parent_id: 1)
    organization.nodes.create(name: "Premiere", parent_id: 1)
    organization.nodes.create(name: "Terminal", parent_id: 1)
    # 
    organization.nodes.create(name: "1", parent_id: 2)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "2", parent_id: 2)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "3", parent_id: 2)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "4", parent_id: 2)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    # 
    organization.nodes.create(name: "S", parent_id: 3)
    organization.nodes.create(name: "ES", parent_id: 3)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "L", parent_id: 3)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    # 
    organization.nodes.create(name: "S", parent_id: 4)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "ES", parent_id: 4)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "L", parent_id: 4)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    # create topics
    organization.nodes.create(name: "Maths", parent_id: 9)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "Anglais", parent_id: 9)
    Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
    organization.nodes.create(name: "Histoire", parent_id: 9)
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

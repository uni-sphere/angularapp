namespace :sandbox do
  desc "reset"
  task reset: :environment do

    #set subdomain
    organization = Organization.find_by_subdomain 'sandbox'
    awsdocument_sandbox = Awsdocument.where(user_id: User.find_by_email('user@unisphere.eu').id, title: 'cours.pdf').first

    if Time.now - organization.nodes.first.created_at <= 12.hours and Rails.env.production?
      #destroy data
      awsdocuments = organization.awsdocuments
      nodes = organization.nodes
      awsdocuments.each do |a|
        a.destroy if a.id != awsdocument_sandbox.id
      end
      nodes.each do |node|
        chapters = node.chapters
        chapters.each do |chapter|
          chapter.destroy
        end
        node.destroy
      end

      #create initial data
      user = User.find_by_email('hello@unisphere.eu')
      node = organization.nodes.create(name: 'University', parent_id: 0, user_id: user.id)
      # create nodes
      parent_2 = organization.nodes.create(name: "Seconde", parent_id: node.id, user_id: user.id)
      parent_3 = organization.nodes.create(name: "Premiere", parent_id: node.id, user_id: user.id)
      parent_4 = organization.nodes.create(name: "Terminal", parent_id: node.id, user_id: user.id)
      #
      node_chap = organization.nodes.create(name: "Histoire", parent_id: parent_2.id, user_id: user.id)
      parent_chap = node_chap.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "Français", parent_id: parent_2.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "Physique", parent_id: parent_2.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "Biologie", parent_id: parent_2.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      #
      parent_9 = organization.nodes.create(name: "S", parent_id: parent_3.id, user_id: user.id)
      node = organization.nodes.create(name: "ES", parent_id: parent_3.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "L", parent_id: parent_3.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      #
      node = organization.nodes.create(name: "S", parent_id: parent_4.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "ES", parent_id: parent_4.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "L", parent_id: parent_4.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      # create topics
      node = organization.nodes.create(name: "Maths", parent_id: parent_9.id, user_id: user.id)
      # add_reports(node)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "Anglais", parent_id: parent_9.id, user_id: user.id)
      # add_reports(node)
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

      awsdocument_sandbox.update(chapter_id: parent_19.id, archived: false)
    end

  end
  
  task force_reset: :environment do

    #set subdomain
    organization = Organization.find_by_subdomain 'sandbox'
    awsdocument_sandbox = Awsdocument.where(user_id: User.find_by_email('user@unisphere.eu').id, title: 'cours.pdf').first

    if true
      #destroy data
      awsdocuments = organization.awsdocuments
      nodes = organization.nodes
      awsdocuments.each do |a|
        a.destroy if a.id != awsdocument_sandbox.id
      end
      nodes.each do |node|
        chapters = node.chapters
        chapters.each do |chapter|
          chapter.destroy
        end
        node.destroy
      end

      #create initial data
      user = User.find_by_email('hello@unisphere.eu')
      node = organization.nodes.create(name: 'University', parent_id: 0, user_id: user.id)
      # create nodes
      parent_2 = organization.nodes.create(name: "Seconde", parent_id: node.id, user_id: user.id)
      parent_3 = organization.nodes.create(name: "Premiere", parent_id: node.id, user_id: user.id)
      parent_4 = organization.nodes.create(name: "Terminal", parent_id: node.id, user_id: user.id)
      #
      node_chap = organization.nodes.create(name: "Histoire", parent_id: parent_2.id, user_id: user.id)
      parent_chap = node_chap.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "Français", parent_id: parent_2.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "Physique", parent_id: parent_2.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "Biologie", parent_id: parent_2.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      #
      parent_9 = organization.nodes.create(name: "S", parent_id: parent_3.id, user_id: user.id)
      node = organization.nodes.create(name: "ES", parent_id: parent_3.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "L", parent_id: parent_3.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      #
      node = organization.nodes.create(name: "S", parent_id: parent_4.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "ES", parent_id: parent_4.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "L", parent_id: parent_4.id, user_id: user.id)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      # create topics
      node = organization.nodes.create(name: "Maths", parent_id: parent_9.id, user_id: user.id)
      # add_reports(node)
      node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
      node = organization.nodes.create(name: "Anglais", parent_id: parent_9.id, user_id: user.id)
      # add_reports(node)
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

      awsdocument_sandbox.update(chapter_id: parent_19.id, archived: false)
    end

  end
end

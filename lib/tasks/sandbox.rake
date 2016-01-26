namespace :sandbox do
  desc "Reset DB"
  task completly_reset_db: :environment do
    # Clear db
    Rake::Task["db:drop"].invoke
    Rake::Task["db:create"].invoke
    Rake::Task["db:migrate"].invoke

    # Create sandbox
    organization = Organization.create(name: 'Sandbox', website: 'http://sandbox.unisphere.eu', latitude: "48.458770", longitude: "7.476686")
    
    # Create a users
    organization.users.create!(email: "hello@unisphere.eu", name: "Hello", uid: "foo", provider: 'email', password: 'gabgabgab', help: false, superadmin: true)
    organization.users.create!(email: "superadmin@unisphere.eu", name: "User", uid: "foo", provider: 'email', password: 'gabgabgab', help: false, superadmin: true)
    organization.users.create!(email: "teacher@unisphere.eu", name: "User", uid: "foo", provider: 'email', password: 'gabgabgab', help: false)

    fill_sandbox
  end

  desc "Reset the sandbox every day"
  task clock_sandbox: :environment do

    #find the organization
    organization = Organization.find_by_subdomain 'sandbox'
    # awsdocument_sandbox = Awsdocument.where(user_id: User.find_by_email('hello@unisphere.eu').id, title: 'cours.pdf').first

    nodes = organization.nodes
   
    if Time.now - organization.nodes.first.created_at >= 12.hours
       delete_chapters_and_nodes(nodes)
       fill_sandbox

    #   awsdocuments = organization.awsdocuments
    #   nodes = organization.nodes

    #   delete_chapters(args[:nodes])

    #   # Destroy documents
    #   # awsdocuments.each do |a|
    #   #   a.destroy if a.id != awsdocument_sandbox.id
    #   # end
     

    #   #create initial data
    #   # user = User.find_by_email('hello@unisphere.eu')
    end

  end

  desc "Force reset the sandbox"
  task force_reset_sandbox: :environment do
    organization = Organization.find_by_subdomain 'sandbox'
    nodes = organization.nodes

    delete_chapters_and_nodes(nodes)
    fill_sandbox
  end

  desc "Create ifma"
  task create_ifma: :environment do
    Rake::Task['organization:create'].invoke("ifma", "http://ifma.unisphere.eu", 29.778004, -95.544143)
    # rake organization:create["ifma", "http://ifma.unisphere.eu", 29.778004, -95.544143]
  end

  def delete_chapters_and_nodes(nodes)
    nodes.each do |node|
      chapters = node.chapters
      chapters.each do |chapter|
        chapter.destroy
      end
      node.destroy
    end
  end

  def to_utf8(str)
    str = str.force_encoding('UTF-8')
    return str if str.valid_encoding?
    str.encode("UTF-8", 'binary', invalid: :replace, undef: :replace, replace: '')
  end

  def fill_sandbox
    # Select variable
    organization = Organization.find_by_subdomain 'sandbox'
    user = User.find_by_email('hello@unisphere.eu')
    node = organization.nodes.create(name: 'University', parent_id: 0, user_id: user.id)
    
    # Create nodes
    parent_2 = organization.nodes.create(name: "Seconde", parent_id: node.id, user_id: user.id)
    parent_3 = organization.nodes.create(name: "Premiere", parent_id: node.id, user_id: user.id)
    parent_4 = organization.nodes.create(name: "Terminal", parent_id: node.id, user_id: user.id)
    node_chap = organization.nodes.create(name: "Histoire", parent_id: parent_2.id, user_id: user.id)
    parent_chap = node_chap.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Français", parent_id: parent_2.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Physique", parent_id: parent_2.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Biologie", parent_id: parent_2.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    parent_9 = organization.nodes.create(name: "S", parent_id: parent_3.id, user_id: user.id)
    node = organization.nodes.create(name: "ES", parent_id: parent_3.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "L", parent_id: parent_3.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "S", parent_id: parent_4.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "ES", parent_id: parent_4.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "L", parent_id: parent_4.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    
    # Create topics
    node = organization.nodes.create(name: "Maths", parent_id: parent_9.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Anglais", parent_id: parent_9.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Histoire", parent_id: parent_9.id, user_id: user.id)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    
    # Create chapters
    parent_13 = node_chap.chapters.create(title: "Les rois de France", parent_id: parent_chap.id, user_id: user.id)
    chap_file = node_chap.chapters.create(title: "Cours", parent_id: parent_13.id, user_id: user.id)
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

    # create documents
    file=File.open(Rails.root + "app/assets/files/lesson1.pdf")
    chap_file.awsdocuments.create(title: "file1.pdf", content: file, user_id: user.id, position: 1, organization_id: 1)
  end
end

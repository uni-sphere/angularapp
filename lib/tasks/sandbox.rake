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

  def add_reports(node)
    for i in 1..10
      node.reports.create(downloads: Random.rand(50))
      # report = Report.last
      # date = report.created_at-(11-i)*7.days
      # report.update(created_at: date)
    end
  end

  def fill_sandbox
    # Select variable
    organization = Organization.find_by_subdomain 'sandbox'
    user = User.find_by_email('hello@unisphere.eu')
    node = organization.nodes.create(name: 'University', parent_id: 0, user_id: user.id)
   
    # Create nodes
    parent_2 = organization.nodes.create(name: "Year 1", parent_id: node.id, user_id: user.id)
    parent_3 = organization.nodes.create(name: "Year 2", parent_id: node.id, user_id: user.id)
    parent_4 = organization.nodes.create(name: "Year 3", parent_id: node.id, user_id: user.id)
    parent_5 = organization.nodes.create(name: "Year 4", parent_id: node.id, user_id: user.id)
    
    
    # Year 1 nodes
    node_chap = organization.nodes.create(name: "Astronomy", parent_id: parent_2.id, user_id: user.id)
    add_reports(node_chap)
    
    
    parent_chap = node_chap.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Atomic Physics", parent_id: parent_2.id, user_id: user.id)
    add_reports(node)
    
    
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Thermal Physics", parent_id: parent_2.id, user_id: user.id)
    add_reports(node)
    
    
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Mathematical Methods I", parent_id: parent_2.id, user_id: user.id)
    add_reports(node)
    
    
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Mathematical Methods II", parent_id: parent_2.id, user_id: user.id)
    add_reports(node)
    
    
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Mechanics", parent_id: parent_2.id, user_id: user.id)
    add_reports(node)
    
    
    
    
     # Year 2 nodes
    

    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Atomic and Molecular Physics", parent_id: parent_3.id, user_id: user.id)
    add_reports(node)
    


    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Electricity and Magnetism", parent_id: parent_3.id, user_id: user.id)
    add_reports(node)
    
   
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Mathematical Methods III", parent_id: parent_3.id, user_id: user.id)
    add_reports(node)
    
    
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Practical Physics", parent_id: parent_3.id, user_id: user.id)
    add_reports(node)
    
        node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Quantum Physics", parent_id: parent_3.id, user_id: user.id)
    add_reports(node)
    
           node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Statistical Physics", parent_id: parent_3.id, user_id: user.id)
    add_reports(node)
    
    
    
    
     # Year 3 nodes
    

    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "BSc Physcis Project", parent_id: parent_4.id, user_id: user.id)
    add_reports(node)
    
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Electromagnetic Theory", parent_id: parent_4.id, user_id: user.id)
    add_reports(node)
    

  node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Lasers and Modern Optics", parent_id: parent_4.id, user_id: user.id)
    add_reports(node)
    
        node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Materials and Nanomaterials", parent_id: parent_4.id, user_id: user.id)
    add_reports(node)
    
    
        
           node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Quantum Mechanics", parent_id: parent_4.id, user_id: user.id)
    add_reports(node)
    
    

    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Solid State Physics", parent_id: parent_4.id, user_id: user.id)
    add_reports(node)
    
   

    
  

    
    
    
    
     # Year 4 nodes
    

    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Advanced Quantum Theory", parent_id: parent_5.id, user_id: user.id)
    add_reports(node)
    


    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "High Energy Physics", parent_id: parent_5.id, user_id: user.id)
    add_reports(node)
    
   
           node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Molecular Biophysics", parent_id: parent_5.id, user_id: user.id)
    add_reports(node)
    
   
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "MSci Physcis Project", parent_id: parent_5.id, user_id: user.id)
    add_reports(node)
    
    
    
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Particle Physics", parent_id: parent_5.id, user_id: user.id)
    add_reports(node)
    

           node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    node = organization.nodes.create(name: "Quantum Field Theory", parent_id: parent_5.id, user_id: user.id)
    add_reports(node)
    
    
    
    
    
   
    # Create chapters (folders)
    node.chapters.create(title: "main", parent_id: 0, user_id: user.id)
    
    parent_13 = node_chap.chapters.create(title: "Assignments", parent_id: parent_chap.id, user_id: user.id)
 
    parent_16 = node_chap.chapters.create(title: "Lecture Notes", parent_id: parent_chap.id, user_id: user.id)
    
    parent_19 = node_chap.chapters.create(title: "Handouts", parent_id: parent_chap.id, user_id: user.id)
    
    parent_21 = node_chap.chapters.create(title: "Homework", parent_id: parent_chap.id, user_id: user.id)

 
    # create documents
    file=File.open(Rails.root + "app/assets/files/assignments.pdf")
    file2=File.open(Rails.root + "app/assets/files/handout.pdf")
    file3=File.open(Rails.root + "app/assets/files/homework.pdf")
    file4=File.open(Rails.root + "app/assets/files/notes.docx")
    parent_13.awsdocuments.create(title: "assignments.pdf", content: file, user_id: user.id, position: 1, organization_id: 1)
    parent_16.awsdocuments.create(title: "notes.docx", content: file4, user_id: user.id, position: 1, organization_id: 1)
    parent_19.awsdocuments.create(title: "handout.pdf", content: file2, user_id: user.id, position: 1, organization_id: 1)
    parent_21.awsdocuments.create(title: "homework.pdf", content: file3, user_id: user.id, position: 1, organization_id: 1)
  end
end

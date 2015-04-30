organization = Organization.create(name: 'Sandbox')
date = organization.created_at-12*7.days
organization.update(created_at: date)
for i in 0..15
  user = organization.users.new(email: (0...3).map { (65 + rand(26)).chr }.join+'@'+(0...3).map { (65 + rand(26)).chr }.join+'.fr')
  user.password = 'sandbox'
  user.save
  date = user.created_at - Random.rand(70).days
  user.update(created_at: date)
end
organization.nodes.create(name: "Sandbox", parent_id: 0)
Node.last.reports.create
organization.nodes.create(name: "premiere", parent_id: 1)
Node.last.reports.create
organization.nodes.create(name: "S", parent_id: 2)
node = Node.last
for i in 1..10
  node.reports.create(downloads: Random.rand(50))
  report = Report.last
  date = report.created_at-(11-i)*7.days
  report.update(created_at: date)
end
Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
organization.nodes.create(name: "ES", parent_id: 2)
node = Node.last
for i in 1..10
  node.reports.create(downloads: Random.rand(50))
  report = Report.last
  date = report.created_at-(11-i)*7.days
  report.update(created_at: date)
end
Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
organization.nodes.create(name: "terminal", parent_id: 1)
Node.last.reports.create
organization.nodes.create(name: "L", parent_id: 5)
node = Node.last
for i in 1..10
  node.reports.create(downloads: Random.rand(50))
  report = Report.last
  date = report.created_at-(11-i)*7.days
  report.update(created_at: date)
end
Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
organization.nodes.create(name: "STI", parent_id: 5)
node = Node.last
for i in 1..10
  node.reports.create(downloads: Random.rand(50))
  report = Report.last
  date = report.created_at-(11-i)*7.days
  report.update(created_at: date)
end
Node.last.chapters.create(title: "main", parent_id: 0, user_id: 1)
node = Organization.last.nodes.last
node.chapters.create(title: "Algebre", parent_id: 4, user_id: 1)
node.chapters.create(title: "Endomorphismes", parent_id: 5, user_id: 1)
node.chapters.create(title: "Produit scalaire", parent_id: 5, user_id: 1)
node.chapters.create(title: "Analyse", parent_id: 4, user_id: 1)
node.chapters.create(title: "Fonctions", parent_id: 8, user_id: 1)
node.chapters.create(title: "Derivees", parent_id: 8, user_id: 1)
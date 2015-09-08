organization = Organization.find 
awsdocuments = organization.awsdocuments
nodes = organization.nodes
links = Organizationsuserslink.where(organization_id: organization.id)

awsdocuments.each do |a|
a.destroy
end

nodes.each do |node|
chapters = node.chapters
chapters.each do |chapter|
chapter.destroy
end
node.destroy
end

links.each do |link|
link.destroy
end

organization.destroy
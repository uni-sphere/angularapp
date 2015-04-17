# require 'spec_helper'
# require 'rails_helper'
# require 'helpers'
#
# describe AwsdocumentsController do
#   describe 'Awsdocument' do
#
#     before do
#       Organization.create!(name: 'organization_name')
#       Organization.last.nodes.create!(name: 'node_name', parent_id: 0)
#       params = {title: 'awsdocument_name', node_id: Node.last.id, parent_id: 0}
#       post "create", params
#       @awsdocument = Awsdocument.last
#     end
#
#     it 'has a name' do
#       expect( @awsdocument.title ).to match 'awsdocument_name'
#     end
#
#     it 'is updated' do
#       @awsdocument.update(title: 'updated_name')
#       expect( @awsdocument.title ).to match 'updated_name'
#     end
#
#     it 'is deleted and also its awsdocuments' do
#       id = @awsdocument.id
#       awsdocument = @awsdocument.awsdocuments.new(title: 'document_title')
#       awsdocument.save(validate: false)
#       @awsdocument.destroy
#       expect( Awsdocument.where(awsdocument_id: id).count ).to match 0
#     end
#
#   end
# end
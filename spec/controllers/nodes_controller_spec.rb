require 'spec_helper'
require 'rails_helper'
require 'helpers'

describe NodesController do
  describe 'Node' do

    before do
      Organization.create!(name: 'organization_name')
      current_admin = Organization.last.users.create(email: 'name@domain.com', password: 'psw')
      @parent = Organization.last.nodes.create!(name: 'parent_name', parent_id: 0)
      params = {name: 'node_name', parent_id: @parent.id, organization_id: Organization.last.id } 
      post "create", params
      @node = Node.last
    end
    
    it 'has a parent' do
      expect( @node.parent_id ).to match @parent.id
    end

    it 'has a name' do
      expect( @node.name ).to match 'node_name'
    end

    it 'has a first chapter' do
      expect( Chapter.where(node_id: @node.id).first.node_id ).to match @node.id
    end
    
    it 'is updated' do
      @node.update(name: 'updated_name')
      expect( @node.name ).to match 'updated_name'
    end
    
    it 'is deleted and also its chapters' do
      id = @node.id
      @node.chapters.create!(title: 'chapter_title', parent_id: 0, user_id: current_admin.id)
      @node.destroy
      expect( Chapter.where(node_id: id).count ).to match 0
    end

  end
end
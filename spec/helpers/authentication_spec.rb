require 'spec_helper'
require 'rails_helper'
require 'helpers'

describe AuthenticationHelper, type: :helper do
  
  before do
    Organization.create!(name: 'organization_name')
  end

  describe "#current_organization" do
    it "returns organization" do
      expect(helper.send(:current_organization)).not_to be_nil
    end
  end

  describe "#get_node" do
    
    before do
      Organization.last.nodes.create!(name: 'node_name', parent_id: 0)
      params[:node_id] = 1
    end
    
    it "returns node" do
      expect(helper.send(:current_node)).not_to be_nil
    end
    
  end

  describe "#get_chapter" do
    
    before do
      organization = Organization.last.nodes.create!(name: 'node_name', parent_id: 0)
      Organization.last.users.create(email: 'name@domain.com', password: 'psw')
      params[:node_id] = 1
      Node.last.chapters.create!(title: 'chapter_title', parent_id: 0, user_id: User.last.id)
      params[:chapter_id] = 1
    end
    
    it "returns chapter" do
      expect(helper.send(:current_chapter)).not_to be_nil
    end
  end

end
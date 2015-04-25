require 'spec_helper'
require 'rails_helper'
require 'helpers'

describe ChaptersController do
  describe 'Chapter' do
    before do
      Organization.create!(name: 'organization_name')
      current_admin = Organization.last.users.create(email: 'name@domain.com', password: 'psw')
      Organization.last.nodes.create!(name: 'node_name', parent_id: 0)
      params = {title: 'chapter_name', node_id: Node.last.id, parent_id: 0}
      post "create", params
      @chapter = Chapter.last
    end

    it 'has a name' do
      expect( @chapter.title ).to match 'chapter_name'
    end
    
    it 'is updated' do
      @chapter.update(title: 'updated_name')
      expect( @chapter.title ).to match 'updated_name'
    end
    
    # it 'is deleted and also its awsdocuments' do
    #   id = @chapter.id
    #   awsdocument = @chapter.awsdocuments.new(title: 'document_title')
    #   awsdocument.save!(validate: false)
    #   @chapter.destroy
    #   expect( Awsdocument.where(chapter_id: id).count ).to match 0
    # end
    
  end
end
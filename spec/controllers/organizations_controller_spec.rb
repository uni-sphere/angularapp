require 'spec_helper'
require 'rails_helper'
require 'helpers'

describe OrganizationsController do
  describe 'Organization' do
    
    before do
      params = {name: 'organization_name', email: 'clement@muller.uk.net', password: 'organization_psw'}
      post "create", params
      @organization = Organization.last
    end

    it 'has a name' do
      expect( @organization.name ).to match 'organization_name'
    end
 
    it 'has an user' do
      expect( User.where(organization_id: @organization.id) ).to exist
    end

    it 'has a first node' do
      expect( Node.where(organization_id: @organization.id) ).to exist
    end
    
  end
end
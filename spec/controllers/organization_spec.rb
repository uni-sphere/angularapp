require 'spec_helper'
require 'rails_helper'
require 'helpers'

describe OrganizationsController do
  describe 'Organization' do

    it 'has a name' do
      params = {name: 'organization_name'}
      post "create", params
      response = json(response.body)
      expect(response.name).to match 'organization_name'
    end
 
    it 'has a user' do
      params = {name: 'organization_name', password: 'organization_password'}
      post "create", params
      response = json(response.body)
      organization = Organization.find(response.id)
      expect( User.where(organization_id:organization.id) ).to exist
    end
  
    it 'has a first node' do
      params = {name: 'organization_name'}
      post "create", params
      response = json(response.body)
      organization = Organization.find(response.id)
      expect( Node.where(organization_id:organization.id) ).to exist
    end
    
  end
end
require 'spec_helper'
require 'rails_helper'
require 'helpers'

describe OrganizationsController do
  describe 'User' do
    
    before do
      params = {name: 'organization_name', email: 'clement@muller.uk.net', password: 'organization_psw'}
      post "create", params
      @user = User.last
    end

    it 'has an email corresponding to input' do
      expect( @user.email ).to match 'clement@muller.uk.net'
    end
 
    it 'has an access' do
      expect( @user.access ).not_to be_empty
    end

    it 'has an access alias corresponding to input' do
      expect( @user.access_alias ).to match 'organization_psw'
    end
    
  end
end
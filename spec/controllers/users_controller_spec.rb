require 'spec_helper'
require 'rails_helper'
require 'helpers'

describe OrganizationsController do
  describe 'User' do
    
    before do
      params = {name: 'organization_name', email: 'clement@muller.uk.net', password: 'password'}
      post "create", params
      @user = User.last
    end

    it 'has an email corresponding to input' do
      expect( @user.email ).to match 'clement@muller.uk.net'
    end
    
    it 'has a password corresponding to input' do
      expect( @user.password ).to match 'password'
    end
    
  end
end
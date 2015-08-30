class UsersController < ApplicationController
  
  before_action :current_subdomain
  before_action :current_organization, only: [:index_by_organization]
  
  def index
    render json: {actions: Action.last(40)}.to_json, status: 200
  end
  
  def index_by_organization
    render json: {actions: Action.where(organization_id: @current_organization.id, error: false).last(15)}.to_json, status: 200
  end
  
  def index_by_user
    render json: {actions: Action.where(user_id: current_user.id, error: false).last(15)}.to_json, status: 200
  end
  
end

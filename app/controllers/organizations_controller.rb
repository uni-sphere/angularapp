class OrganizationsController < ActionController::Base
	
  before_action :get_organization, only: [:show, :update, :destroy]
  
  def create
    organization = Organization.new(organization_params)
    if user.save
      render json: organization, status: 201, location: organization
    else
      render json: organization.errors, status: 422
    end
  end
  
  def show
    render json: @organization, status: 200
  end
  
  def update
    if @organization.update(organization_params)
      render json: @organization, status: 200
    else
      render json: @organization.errors, status: 422
    end
  end
  
  def destroy
    @organization.destroy
    head 204
  end
  
  def index
    organizations = Organization.all
    render json: organizations, status: 200
  end
  
  private
  
  def get_organization
    if Organization.exists? params[:id]
      @organization = Organization.find params[:id]
    else
      render json: {error: "resource not found"}.to_json, status: 404
    end
  end
  
  def organization_params
    params.require(:organization).permit(:name, :organization_token)
  end
  
end
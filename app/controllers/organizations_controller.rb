class OrganizationsController < ActionController::Base
	
  before_action :get_organization, only: [:show, :update, :destroy]
  
  def create
    @organization = Organization.new(organization_params)
    respond_with @organization.save ? @organization : @organization.errors
  end
  
  def show
    respond_with @organization.nil? ? {error: true}.to_json : @organization
  end
  
  def update
    respond_with @organization.save ? @organization : @organization.errors
  end
  
  def destroy
    respond_with @organization.nil? ? {error: 'organization unknown'}.to_json : @organization.destroy
  end
  
  def index
    @organizations = Organization.all
  end
  
  private
  
  def get_organization
    @organization = Organization.find params[:id]
  end
  
  def organization_params
    params.require(:organization).permit(:name, :organization_token)
  end
  
end
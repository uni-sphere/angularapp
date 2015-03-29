class OrganizationsController < ActionController::Base
	
  skip_before_action :authenticate_organization, only: :create
  
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
  
  def organization_params
    params.require(:organization).permit(:name, :classes)
  end
  
end
class OrganizationsuserslinksController < ApplicationController

  def create
    if params[:user_id] and params[:organization_id]
      link = Organizationsuserslink.new(user_id: User.find_by_email(params[:email]).id, organization_id: params[:organization_id])
      if link.save
        render json: {success: true}.to_json, status: 201
      else
        render json: link.errors, status: 422
      end
    else
      send_error('Params not received', '400')
    end
  end
  
end

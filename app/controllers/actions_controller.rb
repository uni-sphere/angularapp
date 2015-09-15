class ActionsController < ApplicationController

  before_action :is_superadmin?

  def index
    render json: {actions: Action.last(40)}.to_json, status: 200
  end

  def index_by_organization
    render json: {actions: Action.where(organization_id: current_organization.id).last(15)}.to_json, status: 200
  end

  def index_by_user
    render json: {actions: Action.where(user_id: current_user.id, error: false).last(15)}.to_json, status: 200
  end

  private

  def is_superadmin?
    send_error('Forbidden', 403) unless current_user.superadmin
  end

end

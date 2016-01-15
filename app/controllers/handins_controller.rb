class HandinsController < ApplicationController

  def create
    assignment = Assignment.find(params[:assignment_id])
    handin = assignment.handins.new(organization_id: current_organization.id, user_id: params[:user_id], node_id: params[:node_id], name_user: params[:name_user])
    if assignment.save
      render json: handin, status: 201
    else
      render json: handin.errors, status: 422
    end
  end

  def index
    handin_array = Handin.where(archived: false, user_id: current_user.id, organization_id: current_organization.id)
    render json: {handin_array: handin_array}.to_json, status: 200
  end

  def index_assignment
    handin_array = Handin.where(archived: false, assignment_id: params[:assignment_id])
    render json: {handin_array: handin_array}.to_json, status: 200
  end

end


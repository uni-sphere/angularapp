class AssignmentsController < ApplicationController

  # before_action :authenticate_user!, only: [:create, :update, :destroy]
  # before_action :is_allowed?, only: [:update, :destroy]

  def create
    node = Node.find(params[:node_id])
    assignment = node.assignments.new(node_name: params[:node_name], title: params[:title], count: params[:count], subject: params[:subject], user_id: current_user.id)
    # chapter.node_name = current_node.chapters.where(archived: false).first.id if chapter.parent_id == 0
    if assignment.save
      # Action.create(name: 'created', obj_id: current_node.assignments.last.id, object_type: 'assignment', object: current_node.chapters.last.title, organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: assignment, status: 201
    else
      # Action.create(name: 'created', error: true, object_type: 'assignment', organization_id: current_organization.id, user_id: current_user.id, user: current_user.email)
      render json: chapter.errors, status: 422
    end
  end

end


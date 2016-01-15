class AssignmentsController < ApplicationController

  def create
    node = Node.find(params[:node_id])
    assignment = node.assignments.new(organization_id: current_organization.id, node_name: params[:node_name], title: params[:title], subject: params[:subject], user_id: current_user.id)
    if assignment.save
      render json: assignment, status: 201
    else
      render json: assignment.errors, status: 422
    end
  end

  def index
    
    # Student
    if params[:student]
      assignment_selected = Assignment.find(params[:assignment_id])
      list_assignment_id = []
      Handin.where(user_id: current_user.id).each do |handin|
        list_assignment_id << handin.assignment_id
      end

      # we remove the id of the selected assignment
      list_assignment_id.delete(assignment_selected.id)

      assignment_array = Assignment.where(id: list_assignment_id)
      # we need to see if the assignment selected is also in the list of handin
      # assignment_array.include? assignment_selected
      # assignment_array.delete(assignment_selected)
      assignment_array.unshift(assignment_selected)
    else
      assignment_array = Assignment.where(archived: false, organization_id: current_organization.id, user_id: current_user.id)
    end

    render json: {assignment_array: assignment_array}.to_json, status: 200
  end

  def index_node
    assignment_array = Assignment.where(archived: false, node_id: params[:node_id])
    render json: {assignment_array: assignment_array}.to_json, status: 200
  end

end


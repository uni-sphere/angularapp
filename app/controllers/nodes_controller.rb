class NodesController < ApplicationController
	
  def create
    node = current_organization.nodes.new(name: params[:name], parent_id: params[:parent_id])
    parent = current_organization.nodes.find params[:parent_id]
    report = node.reports.new
    if node.save and report.save
      if parent.chapters.count > 1
        parent.chapters.each do |chapter|
          chapter.update(node_id: node.id)
        end
      else
        chapter = node.chapters.new(title: 'main', parent_id: 0, user_id: current_user.id)
        chapter.save
      end
      render json: node, status: 201, location: node
    else
      render json: node.errors, status: 422
    end
  end
  
  def update
    if current_node.update(name: params[:name])
      render json: current_node, status: 200
    else
      render json: current_node.errors, status: 422
    end
  end
  
  def destroy
    if current_node.parent_id != 0
      destroy_with_children(current_node.id)
      head 204
    else
      send_error('You can not destroy the root of your tree', 400)
    end
  end
  
  def index
    nodes = []
    current_organization.nodes.each do |node|
      nodes << {name: node.name, num: node.id, parent: node.parent_id}
    end
    render json: nodes, status: 200
  end
  
  def destroy_with_children(id)
    if Node.exists?(parent_id: id)
      Node.where(parent_id: id).each do |node|
        destroy_with_children(node.id)
      end
    end
    Node.find(id).destroy
  end
  
end
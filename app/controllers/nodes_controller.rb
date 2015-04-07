class NodesController < ApplicationController
  
  before_action :get_node, only: [:show, :update, :destroy]
	
  def create
    node = @organization.nodes.new(node_params)
    chapter = node.chapters.new(title: 'main', parent_id: 0)
    if node.save
      render json: node, status: 201, location: node
    else
      render json: node.errors, status: 422
    end
  end
  
  def show
    render json: @node, status: 200
  end
  
  def update
    if @node.update(name: params[:name])
      render json: @node, status: 200
    else
      render json: @node.errors, status: 422
    end
  end
  
  def destroy
    if @node.parent_id != 0
      @node.destroy
      head 204
    else
      send_error('You can not destroy the root of your tree', 400)
    end
  end
  
  def index
    nodes = []
    @organization.nodes.each do |node|
      nodes << {name: node.name, num: node.id, parent: node.parent_id}
    end
    render json: nodes, status: 200
  end
  
  private
  
  def node_params
    params.require(:node).permit(:name, :parent_id)
  end
  
end
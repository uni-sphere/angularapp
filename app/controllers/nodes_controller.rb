class NodesController < ActionController::Base
  
  before_action :get_node(params[:id]), only: [:show, :update, :destroy]
	
  def create
    node = @organization.nodes.new(node_params)
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
    if @node.update(node_params)
      render json: @node, status: 200
    else
      render json: @node.errors, status: 422
    end
  end
  
  def destroy
    @node.destroy
    head 204
  end
  
  def index
    nodes = []
    @organization.nodes.each do |node|
      nodes << {name: node.name, num: node.id, parent: node.parent_id}.to_json
    end
    render json: nodes, status: 200
  end
  
  private
  
  def node_params
    params.require(:node).permit(:name, :parent_id)
  end
  
end
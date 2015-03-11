class NodesController < ActionController::Base
  
  before_action :get_node, only: [:show, :update, :destroy]
	
  def create
    node = current_organization.nodes.new(node_params)
    if user.save
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
    nodes = current_organization.nodes.all
    render json: nodes, status: 200
  end
  
  private
  
  def get_node
    if current_organization.nodes.exists? params[:id]
      @node = current_organization.nodes.find params[:id]
    else
      render json: {error: "resource not found"}.to_json, status: 404
    end
  end
  
  def node_params
    params.require(:node).permit(:name, :parent_id, :organization_id)
  end
  
end
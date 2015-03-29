class NodesController < ActionController::Base
  
  before_action :get_node(params[:id]), only: [:show, :update, :destroy]
	
  def create
    node = @organization.nodes.new(node_params)
    node.user_id = @user.id
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
    if @superadmin
      nodes = @organization.nodes.all
      render json: nodes, status: 200
    else
      render json: {error: 'unauthorized'}.to_json, status: 401
    end
  end
  
  private
  
  def node_params
    params.require(:node).permit(:name, :parent_id, :organization_id)
  end
  
end
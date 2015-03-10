class NodesController < ActionController::Base
  
  before_action :get_node, only: [:show, :update, :destroy]
	
  def create
    @node = current_organization.nodes.new(node_params)
    respond_with @awsdocument.save ? @awsdocument : @awsdocument.errors
  end
  
  def show
    respond_with @node.nil? ? {error: true}.to_json : @node
  end
  
  def update
    respond_with @node.save ? @awsdocument : @node.errors
  end
  
  def destroy
    respond_with @node.nil? ? {error: 'node unknown'}.to_json : @node.destroy
  end
  
  def index
    @nodes = current_organization.nodes.all
  end
  
  private
  
  def get_node
    @node = current_organization.nodes.find params[:id]
  end
  
  def node_params
    params.require(:node).permit(:name, :parent_id, :organization_id)
  end
  
end
class AwsdocumentsController < ApplicationController
	
  # before_action :get_node
#   before_action :get_chapter
#   before_action :get_awsdocument, only: [:show, :update, :destroy, :download, :unarchive, :archives]

  def create
    awsdocument = @node.awsdocuments.new(awsdocument_params)
    if awsdocument.save
      render json: awsdocument, status: 201, location: awsdocument
    else
      render json: awsdocument.errors, status: 422
    end
  end
  
  def show
    render json: @awsdocument, status: 200
  end
  
  def archives
    @awsdocuments = @node.awsdocuments.where(archived: false)
  end
  
  def unarchive
    if @awsdocument.unarchive
      render json: @awsdocument, status: 200
    else
      render json: @awsdocument.errors, status: 422
    end
  end
  
  def download
    uploader = DocumentUploader.new
    uploader.retrieve_from_store!('getting_starteds.txt')
    send_file uploader.file.path, :disposition => 'attachment', :url_based_filename => false
  end
  
  def update
    if @awsdocument.update(awsdocument_params)
      render json: @awsdocument, status: 200
    else
      render json: @awsdocument.errors, status: 422
    end
  end
  
  def destroy
    @awsdocument.archive
    head 204
  end
  
  def index
    # awsdocuments = @oganization.nodes.awsdocuments.where(archived: false)
#     render json: awsdocuments, status: 200
render json: 
{
  id: 0,
  items: [{
    id: 2,
    title: "Matrice",
    items: [{
      id: 21,
      title: "Produit matricielle",
      items: [{
        id: 211,
        title: "Cours",
        items: [{
          id: 2111,
          title: "produit simple",
          document: true,
          items: []
        }, 
        {
          id: 2112,
          title: "produit combiné",
          document: true,
          items: []
        }],
      }, 
      {
        id: 212,
        title: "TD",
        items: []
      }],
    }, 
    {
      id: 22,
      title: "Determinant",
      items: [{
        id: 221,
        title: "Cours",
        items: []
      }, 
      {
        id: 222,
        title: "TD",
        items: []
      }],
    }],
  }, 
  {
    id: 3,
    title: "Algèbre",
    items: []
  }, 
  {
    id: 4,
    title: "Aritmétique",
    items: []
  }
]}.to_json
  end
  
  private
  
  def get_awsdocument
    if Awsdocuments.exists? params[:id]
      @awsdocument = @node.awsdocuments.find_unarchived params[:id]
    else
      send_error('resource not found', 404)
    end
  end
  
  def awsdocument_params
    params.require(:awsdocument).permit(:content, :chapter_id, :archived, :name, :type)
  end
  
end
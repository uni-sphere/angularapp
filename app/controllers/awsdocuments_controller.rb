class AwsdocumentsController < ApplicationController
	
  before_action :get_node, except: [:destroy]
  before_action :get_chapter, except: [:destroy]
  before_action :get_awsdocument, only: [:show, :update, :download, :unarchive, :archives]

  def create
    awsdocument = @chapter.awsdocuments.new(title: params[:title], content: params[:file])
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
    # uploader = DocumentUploader.new
    # uploader.retrieve_from_store!('getting_started.txt')
    # send_file uploader.file.path.split('/').last, :disposition => 'attachment', :url_based_filename => false
    
    # url = Awsdocument.last.content.url
    # uploader = DocumentUploader.new
    # uploader.download! url
    # send_file uploader.retrieve_from_cache!(uploader.cache_name)
    
    # doc = Awsdocument.last.content
#     file = open(doc.url).read
#     send_file(file, filename: "getting_started.txt", disposition: 'attachment')
  
  # data = open(Awsdocument.last.content.url)
  # send_data data.read, :type => data.content_type, :x_sendfile => true, :url_based_filename => true
  
  # data = "Hello World!"
  # file = "my_file.txt"
  # File.open(file, "w"){ |f| f << data }
  # File.open(file, "r")
  # send_data( file )
  
  # send_file('/my_file.txt', type: 'text/excel')
  
  # data = "Hello World!"
#   file = "my_file.txt"
#   File.open(file, "w"){ |f| f << data }
#   send_file( file )

send_file(
    "#{Rails.root}/public/uploads/tmp/1428389933-25294-4468/getting_started.txt",
    filename: "getting_started.txt"
  )

  end
  
  def update
    if @awsdocument.update(awsdocument_params)
      render json: @awsdocument, status: 200
    else
      render json: @awsdocument.errors, status: 422
    end
  end
  
  def destroy
    Awsdocument.find(params[:id]).archive
    head 204
  end
  
  def index
    # awsdocuments = @oganization.nodes.awsdocuments.where(archived: false)
#     render json: awsdocuments, status: 200
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
    params.require(:awsdocument).permit(:content, :chapter_id, :archived, :title)
  end
  
end
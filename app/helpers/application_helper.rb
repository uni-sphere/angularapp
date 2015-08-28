module ApplicationHelper
  
  def show_params
    logger.info params.inspect
  end
  
  def clear_logs(log)
    logger.info "************************************  #{log}  ************************************"
  end

  def random_password
    chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
    password = ''
    10.times { password << chars[rand(chars.size)] }
    return password
  end
  
  private
  
  def send_error(error, code)
    render json: {error: error}.to_json, status: code
  end
  
  def destroy_with_children(id)
    @deleted = []
    Node.find(id).chapters.all.each do |chapter|
      @deleted << chapter.id
    end
    if Node.exists?(parent_id: id)
      Node.where(parent_id: id, archived: false).each do |node|
        node.chapters.all.each do |chapter|
          @deleted << chapter.id
        end
        destroy_with_children(node.id)
      end
    end
    Node.find(id).archive
    return @deleted
  end
  
end

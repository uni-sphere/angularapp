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
  
  def can_delete(id)
    queue = [current_node]
    while queue != []
      node = queue.pop
      return false if node.user_id != current_user.id
      Node.where(parent_id: node.id).each do |node|
        queue << node
      end
    end
    return true
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
      Node.where(parent_id: id).each do |node|
        clear_logs node.id
        node.chapters.all.each do |chapter|
          @deleted << chapter.id
        end
        destroy_with_children(node.id)
      end
    end
    Node.find(id).destroy
    return @deleted
  end
  
end

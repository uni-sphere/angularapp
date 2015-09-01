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
  
  def archive_children(id)
    if Node.exists?(parent_id: id)
      Node.where(parent_id: id, archived: false).each do |node|
        node.chapters.where(archived: false).each do |chapter|
          chapter.awsdocuments.where(archived: false).each do |document|
            document.archive
          end
          chapter.archive
        end
        archive_children(node.id)
      end
    end
    Node.find(id).archive
  end
  
  def pull_children(id, parent_id)
    if Node.exists?(parent_id: id)
      Node.where(parent_id: id, archived: false).each do |node|
        node.chapters.where(archived: false).each do |chapter|
          chapter.awsdocuments.where(archived: false).each do |document|
            document.update(node_id: parent_id)
          end
          chapter.update(node_id: parent_id)
        end
        shift_left_children(node.id, parent_id)
      end
    end
    Node.find(id).archive
  end
  
end

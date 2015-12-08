rake db:migrate

Organization.all.each do |organization|
  organization.nodes.where(archived: false).each do |node|
    @pos_node = 0
    nodes_to_order = Node.where(parent_id: node.id, archived: false)
    #
    nodes_to_order.order('created_at ASC').each do |son|
      @pos_node = @pos_node + 1
      son.update(position: @pos_node)
      Rails.logger.info @pos_node
    end
    #
    chapters = node.chapters.where(archived: false)
    chapters.each do |chapter|
      @pos_doc = 0
      @pos_chapter = 0
      sons = Chapter.where(parent_id: chapter.id, archived: false)
      sons.order('created_at ASC').each do |son|
        @pos_chapter = @pos_chapter + 1
        son.update(position: @pos_chapter)
      end
      docs = Awsdocument.where(archived: false, chapter_id: chapter.id)
      docs.order('created_at ASC').each do |doc|
        @pos_doc = @pos_doc + 1
        doc.update(position: @pos_doc)
      end
    end
  end
end

rake newsfeed:true
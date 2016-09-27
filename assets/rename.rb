begin

  root = "./assets/guns/"
  folders = Dir.entries("#{root}")
  folders.each do |dir|
    if (dir[0] != '.')
      nodes = Dir.entries("#{root}/#{dir}")
      nodes.each do |node|
        if (node[0] != '.')
          parts = Dir.entries("#{root}/#{dir}/#{node}")
          parts.each do |part|
            if (part[0] != '.')
              partname = part.gsub("|", "$")
              File.rename("#{root}/#{dir}/#{node}/#{part}", "#{root}/#{dir}/#{node}/#{partname}")
            end
          end
          nodename = node.gsub("|", "$")
          File.rename("#{root}/#{dir}/#{node}", "#{root}/#{dir}/#{nodename}")
        end
      end
    end
  end

end

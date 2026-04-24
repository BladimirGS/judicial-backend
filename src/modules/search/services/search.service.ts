import { SearchRepository } from "../repositories/search.repository";
import { SearchCatalogosDTO } from "../dtos/search-catalogos.dto";
import { SearchParamsDTO } from "../dtos/search-params.dto";
import * as ExcelJS from 'exceljs';
import { TipoParte } from "../../../database/entities/tipo-parte.entity";

export const SearchService = {
    async getFormDataBuscador(): Promise<SearchCatalogosDTO> {
        return await SearchRepository.getSearchCatalogos();
    },

    async search(params: SearchParamsDTO) {
        const resultados = await SearchRepository.searchApelaciones(params);

        return resultados.map(apelacion => ({
            id: apelacion.id,
            folioOficialia: apelacion.folioOficialia,
            folioApelacion: apelacion.folioApelacion,
            folioApelacionAnterior: apelacion.folioApelacion,
            folioOficio: apelacion.folioOficio,
            
            fojas: apelacion.fojas,
            expedienteAcumulado: apelacion.expedienteAcumulado,
            esReposicion: apelacion.esReposicion,
            expedienteCausa: apelacion.expedienteCausa,
            fechaAuto: apelacion.fechaAuto,
            fechaHoraRecepcion: apelacion.fechaHoraRecepcion,
            fechaHoraIngresoJuz: apelacion.fechaHoraIngresoJuz,
            observaciones: apelacion.observaciones,
            asunto: apelacion.asunto,
            lugarHechos: apelacion.lugarHechos,

            // Aplanamos catálogos
            sala: apelacion.sala?.descripcion ?? null,
            salaAnterior: apelacion.sala?.descripcion ?? null,
            juzgadoOrigen: apelacion.catJuzgado?.descripcion ?? null,
            magistradoAsignado: apelacion.catMagistrado?.descripcion ?? null,
            nomenclatura: apelacion.nomenclatura?.descripcion ?? null,
            tipoApelacion: apelacion.tipoApelacion?.descripcion ?? null,
            tipoEscrito: apelacion.tipoEscrito?.descripcion ?? null,

            // Mapeo de anexos
            anexos: apelacion.anexos?.map(a => ({
                id: a.id,
                descripcion: a.idAnexo > 0 ? a.anexo?.descripcion : a.otroAnexo,
                esValor: a.esValor,
                monto: a.monto ?? null,
                cantidad: a.cantidad ?? null
            })) ?? [],

            // Mapeo plano de partes
            partes: apelacion.apelacionPartes.map(ap => ({
                nombre: ap.nombre ?? null,
                direccion: ap.direccion ?? null,
                menorEdad: ap.menorEdad ?? null,
                sexo: ap.sexo.descripcion ?? null,
                tipoParte: ap.tipoParte.descripcion ?? null
            })) ?? []
        }));
    },

    async generateApelacionesExcel(datos: any[]): Promise<ExcelJS.Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Resultados');

        // 1. Configurar anchos de columna razonables
        worksheet.getColumn('A').width = 20; // Folio
        worksheet.getColumn('B').width = 30; // Nombres / Folio Apelación
        worksheet.getColumn('C').width = 25;
        worksheet.getColumn('D').width = 20;
        worksheet.getColumn('E').width = 15;
        worksheet.getColumn('F').width = 15;
        worksheet.getColumn('G').width = 15;

        // 2. Definir Estilos Visuales (Basados en tu imagen)
        const estiloHeaderPrincipal: Partial<ExcelJS.Cell> = {
            font: { bold: true, color: { argb: '000000' } },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '9BC2E6' } }, // Azul claro
            alignment: { horizontal: 'center' },
            border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
        };

        const estiloSubHeader: Partial<ExcelJS.Cell> = {
            font: { bold: true },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } }, // Gris claro
            alignment: { horizontal: 'center' },
            border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
        };

        // 3. Iterar sobre los datos
        datos.forEach((apelacion, index) => {
            
            // --- ENCABEZADO PRINCIPAL (Se imprime solo en el primer registro o en cada uno si prefieres separarlos) ---
            if (index === 0) {
                const filaHeader = worksheet.addRow([
                    'Folio de Oficialía', 'Folio de Apelación', 'Folio Apelación Anterior', 
                    'Trámite', 'Sala', 'Sala Anterior', 'Tipo Apelación'
                ]);
                filaHeader.eachCell(cell => Object.assign(cell, estiloHeaderPrincipal));
            }

            // --- REGISTRO PRINCIPAL ---
            worksheet.addRow([
                apelacion.folioOficialia,
                apelacion.folioApelacion,
                apelacion.folioApelacionAnterior || 'N/A',
                'APELACIÓN', // O el campo de tu JSON
                apelacion.sala,
                apelacion.salaAnterior || 'N/A',
                apelacion.tipoApelacion || 'AUTO'
            ]);

            // --- SUB-TABLA: PARTES ---
            if (apelacion.partes && apelacion.partes.length > 0) {
                // Según tu imagen, los encabezados de partes empiezan en la columna A o B
                const headerPartes = worksheet.addRow([
                    'Parte', 'Nombre', 'Direccion', 'MenorEdad', 'Sexo'
                ]);
                headerPartes.eachCell(cell => Object.assign(cell, estiloSubHeader));

                // Datos de las partes
                apelacion.partes.forEach((p: any) => {
                    const row = worksheet.addRow([
                        p.tipo, 
                        p.nombre, 
                        p.direccion || '', 
                        p.menorEdad ? 'SI' : 'NO', 
                        p.sexo
                    ]);
                    // Borde simple para los datos
                    row.eachCell(cell => cell.border = { top: { style: 'hair' }, bottom: { style: 'hair' }, left: { style: 'hair' }, right: { style: 'hair' } });
                });
            }

            // --- SUB-TABLA: ANEXOS ---
            if (apelacion.anexos && apelacion.anexos.length > 0) {
                // Encabezados de anexos
                const headerAnexos = worksheet.addRow([
                    'idTramiteAnexo', 'TipoTramite', 'Anexo', 'EsValor', 'MontoAnexo', 'Cantidad'
                ]);
                headerAnexos.eachCell(cell => Object.assign(cell, estiloSubHeader));

                // Datos de los anexos
                apelacion.anexos.forEach((a: any) => {
                    const row = worksheet.addRow([
                        a.id, 
                        '1', // Asumo que es fijo o viene en tu JSON
                        a.descripcion, 
                        a.esValor ? 'SI' : 'NO', 
                        a.monto || '', 
                        '1' // Asumo cantidad fija según imagen
                    ]);
                    // Borde simple para los datos
                    row.eachCell(cell => cell.border = { top: { style: 'hair' }, bottom: { style: 'hair' }, left: { style: 'hair' }, right: { style: 'hair' } });
                });
            }

            // --- ESPACIO ENTRE REGISTROS ---
            // Añadimos una fila en blanco para separar visualmente un expediente de otro
            worksheet.addRow([]); 
        });

        return await workbook.xlsx.writeBuffer();
    }
};